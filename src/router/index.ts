import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterStep1View from '../views/RegisterStep1View.vue'
import RegisterView from '../views/RegisterView.vue'
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
import ProfileView from '../views/ProfileView.vue'

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
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register-step1',
      name: 'register-step1',
      component: RegisterStep1View
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
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
