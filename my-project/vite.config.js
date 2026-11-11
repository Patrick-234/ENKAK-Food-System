import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // this IS the login/signup page
        menu: resolve(__dirname, 'menu.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        trackOrder: resolve(__dirname, 'track-order.html'),
        review: resolve(__dirname, 'review.html'),
        account: resolve(__dirname, 'User-account.html'),
        adminDashboard: resolve(__dirname, 'admin-dashboard.html'),
        riderDashboard: resolve(__dirname, 'rider-dashboard.html'),
      }
    }
  }
})