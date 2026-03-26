import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import BranchView from '../views/BranchView.vue'
import MenuView from '../views/MenuView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import CartSummaryView from '../views/CartSummaryView.vue'
import PaymentOptionView from '../views/PaymentOptionView.vue'
import PaymentMethodView from '../views/PaymentMethodView.vue'
import SuccessView from '../views/SuccessView.vue'
import OTPView from '../views/OTPView.vue'
import OrdersView from '../views/OrdersView.vue'
import MenuItemDetailView from '../views/MenuItemDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/item/:id?',
      name: 'itemDetail',
      component: MenuItemDetailView
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/otp',
      name: 'otp',
      component: OTPView
    },
    {
      path: '/branch',
      name: 'branch',
      component: BranchView
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartSummaryView
    },
    {
      path: '/payment-option',
      name: 'payment-option',
      component: PaymentOptionView
    },
    {
      path: '/payment-method',
      name: 'payment-method',
      component: PaymentMethodView
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessView
    }
  ]
})

export default router
