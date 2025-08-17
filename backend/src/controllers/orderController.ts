import { Request, Response } from 'express';
import Order from '../models/Order';
import Dish from '../models/Dish';
import { io } from '../index';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, tableNumber, customerInfo, notes, language, currency, isPickup } = req.body;

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const dish = await Dish.findById(item.dish);
      if (!dish || !dish.availability.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Plat non disponible: ${dish?.name.fr || 'Inconnu'}`
        });
      }

      const itemTotal = dish.price * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        dish: dish._id,
        dishSnapshot: {
          name: dish.name,
          price: dish.price
        },
        quantity: item.quantity,
        notes: item.notes,
        price: itemTotal
      });
    }

    const order = await Order.create({
      tableNumber,
      items: processedItems,
      totalAmount,
      currency: currency || 'THB',
      customerInfo,
      notes,
      language: language || 'en',
      isPickup: isPickup || false
    });

    await order.populate([
      { path: 'items.dish', model: 'Dish' }
    ]);

    io.emit('new-order', {
      order,
      message: 'Nouvelle commande reçue'
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Commande créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const {
      status,
      tableNumber,
      dateFrom,
      dateTo,
      page = '1',
      limit = '20'
    } = req.query;

    const filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (tableNumber) {
      filter.tableNumber = tableNumber;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate([
          { path: 'items.dish', model: 'Dish' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'items.dish', model: 'Dish' }
      ]);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, estimatedTime } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(estimatedTime && { estimatedTime }),
        ...(status === 'served' && { servedAt: new Date() })
      },
      { new: true }
    ).populate([
      { path: 'items.dish', model: 'Dish' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    io.emit('order-status-updated', {
      orderId: order._id,
      status: order.status,
      estimatedTime: order.estimatedTime,
      message: `Commande ${order.orderNumber} mise à jour`
    });

    res.json({
      success: true,
      data: order,
      message: 'Statut de la commande mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut plus être annulée'
      });
    }

    order.status = 'cancelled';
    await order.save();

    io.emit('order-cancelled', {
      orderId: order._id,
      message: `Commande ${order.orderNumber} annulée`
    });

    res.json({
      success: true,
      data: order,
      message: 'Commande annulée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la commande',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrdersByTable = async (req: Request, res: Response) => {
  try {
    const { tableNumber } = req.params;
    
    const orders = await Order.find({ 
      tableNumber,
      status: { $ne: 'cancelled' }
    })
    .populate([
      { path: 'items.dish', model: 'Dish' }
    ])
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes de la table',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};