import 'dart:async';

import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/services/order_service.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';
import 'package:coin_original_mobile/utils/enums.dart';

Future<void> _debugReportOrderProvider(
  String hypothesisId,
  String location,
  String msg,
  Map<String, Object?> data,
) async {}

class OrderProvider extends ChangeNotifier {
  final OrderService _orderService = OrderService();

  List<OrderModel> _orders = [];
  List<OrderModel> _allOrders = [];
  OrderModel? _selectedOrder;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  String? _error;
  Map<String, int> _stats = {};
  double _totalRevenue = 0;
  StreamSubscription<List<OrderModel>>? _adminOrdersSubscription;
  bool _isAdminRealtimeEnabled = false;

  List<OrderModel> get orders => _orders;
  List<OrderModel> get allOrders => _allOrders;
  OrderModel? get selectedOrder => _selectedOrder;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get hasMore => _hasMore;
  String? get error => _error;
  Map<String, int> get stats => _stats;
  double get totalRevenue => _totalRevenue;

  void ensureAdminRealtime() {
    if (_isAdminRealtimeEnabled) return;
    _startAdminRealtime();
  }

  void syncAdminRealtime({required bool enabled}) {
    _debugReportOrderProvider(
      'B',
      'lib/providers/order_provider.dart:72',
      'sync admin realtime called',
      {
        'enabled': enabled,
        'isAdminRealtimeEnabled': _isAdminRealtimeEnabled,
        'currentUserId': FirebaseService.currentUserId,
      },
    );
    if (enabled) {
      _startAdminRealtime();
    } else {
      _stopAdminRealtime(clearOrders: true);
    }
  }

  Future<void> loadUserOrders({bool isRefresh = true}) async {
    final userId = FirebaseService.currentUserId;
    if (userId == null) return;

    if (isRefresh) {
      _setLoading(true);
      _error = null;
      _orders = [];
      _hasMore = true;
    } else {
      if (!_hasMore || _isLoadingMore || _isLoading) return;
      _setLoadingMore(true);
    }

    try {
      final DateTime? startAfter =
          !isRefresh && _orders.isNotEmpty ? _orders.last.createdAt : null;

      final newOrders = await _orderService.getUserOrders(
        userId,
        startAfter: startAfter,
        limit: 10,
      );

      if (isRefresh) {
        _orders = newOrders;
      } else {
        _orders.addAll(newOrders);
      }

      _hasMore = newOrders.length == 10;

      if (isRefresh) {
        _setLoading(false);
      } else {
        _setLoadingMore(false);
      }
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  Future<void> loadAllOrders(
      {OrderStatus? status, bool isRefresh = true}) async {
    if (isRefresh) {
      _setLoading(true);
      _error = null;
      _allOrders = [];
      _hasMore = true;
    } else {
      if (!_hasMore || _isLoadingMore || _isLoading) return;
      _setLoadingMore(true);
    }

    try {
      final DateTime? startAfter = !isRefresh && _allOrders.isNotEmpty
          ? _allOrders.last.createdAt
          : null;

      final newOrders = await _orderService.getAllOrders(
        status: status,
        startAfter: startAfter,
        limit: 10,
      );

      if (isRefresh) {
        _allOrders = newOrders;
      } else {
        _allOrders.addAll(newOrders);
      }

      _hasMore = newOrders.length == 10;

      if (isRefresh) {
        _setLoading(false);
      } else {
        _setLoadingMore(false);
      }
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  Future<void> getOrderById(String id) async {
    _setLoading(true);
    try {
      _selectedOrder = await _orderService.getOrderById(id);
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  Future<bool> createOrder(OrderModel order) async {
    _setLoading(true);
    try {
      await _orderService.createOrder(order);
      final userId = FirebaseService.currentUserId;
      if (userId != null) {
        await loadUserOrders();
      } else {
        _setLoading(false);
      }
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> updateOrderStatus(String id, OrderStatus status) async {
    _setLoading(true);
    try {
      await _orderService.updateOrderStatus(id, status);
      await loadAllOrders();
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<void> loadStats() async {
    _setLoading(true);
    try {
      _stats = await _orderService.getOrderStats();
      _totalRevenue = await _orderService.getTotalRevenue();
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  void _startAdminRealtime() {
    if (_isAdminRealtimeEnabled) return;

    _isAdminRealtimeEnabled = true;
    _setLoading(true);
    _error = null;
    _debugReportOrderProvider(
      'B',
      'lib/providers/order_provider.dart:176',
      'starting admin realtime listener',
      {
        'currentUserId': FirebaseService.currentUserId,
      },
    );

    _adminOrdersSubscription = _orderService.getAllOrdersStream().listen(
      (orders) {
        _allOrders = orders;
        _hasMore = false;
        _isLoading = false;
        _debugReportOrderProvider(
          'C',
          'lib/providers/order_provider.dart:186',
          'admin realtime snapshot received',
          {
            'ordersCount': orders.length,
            'firstOrderId': orders.isNotEmpty ? orders.first.id : null,
            'firstUserName': orders.isNotEmpty ? orders.first.userName : null,
          },
        );
        notifyListeners();
      },
      onError: (error) {
        _error = error.toString();
        _isLoading = false;
        _debugReportOrderProvider(
          'B',
          'lib/providers/order_provider.dart:198',
          'admin realtime listener error',
          {
            'error': error.toString(),
          },
        );
        notifyListeners();
      },
    );
  }

  void _stopAdminRealtime({required bool clearOrders}) {
    _adminOrdersSubscription?.cancel();
    _adminOrdersSubscription = null;
    _isAdminRealtimeEnabled = false;
    if (clearOrders) {
      _allOrders = [];
      notifyListeners();
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setLoadingMore(bool value) {
    _isLoadingMore = value;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearUserOrders() {
    _orders = [];
    _selectedOrder = null;
    _error = null;
    _hasMore = true;
    _isLoading = false;
    _isLoadingMore = false;
    notifyListeners();
  }

  @override
  void dispose() {
    _adminOrdersSubscription?.cancel();
    super.dispose();
  }
}
