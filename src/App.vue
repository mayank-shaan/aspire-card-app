<template>
  <q-app>
    <q-layout view="lHh Lpr lFf">

      <q-drawer
        v-if="isDesktop"
        v-model="leftDrawerOpen"
        show-if-above
        :width="340"
        class="sidebar"
        style="background-color: #0c365a !important;"
      >
        <div class="column full-height q-pa-xl">

          <div class="q-mb-xl">
            <div class="row items-center q-mb-lg q-gutter-sm">
              <SvgIcon name="aspire-logo" category="brand" size="app-bar" />
            </div>
            <p class="tagline q-ma-none">
              Trusted way of banking for 3,000+ SMEs and startups in Singapore
            </p>
          </div>


          <q-list class="navigation-menu">
            <q-item
              v-for="item in navigationItems"
              :key="item.route"
              :to="item.route"
              clickable
              v-ripple
              :active="$route.name === item.name"
              class="nav-item q-mb-md"
            >
              <q-item-section avatar>
                <SvgIcon 
                  :name="item.icon" 
                  category="navigation" 
                  size="lg" 
                  :active="$route.name === item.name"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-drawer>


      <q-footer v-if="isMobile" class="mobile-footer">
        <q-tabs
          v-model="activeTab"
          class="mobile-nav"
          indicator-color="transparent"
          active-color="secondary"
          align="justify"
          dense
        >
          <q-tab
            v-for="item in mobileNavigationItems"
            :key="item.route"
            :name="item.name"
            @click="$router.push(item.route)"
            class="mobile-nav-tab"
            :class="{ 'active-tab': $route.name === item.name }"
            no-caps
          >
            <template #default>
              <div class="mobile-tab-content">
                <SvgIcon 
                  :name="item.icon" 
                  category="navigation" 
                  size="lg" 
                  :active="$route.name === item.name"
                />
                <span class="mobile-tab-label">{{ item.name }}</span>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </q-footer>


      <q-page-container class="main-container">
        <router-view />
      </q-page-container>
    </q-layout>
  </q-app>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useResponsive } from '@/composables/useResponsive';
import { useUIStore } from '@/stores/uiStore';
import type { NavigationItem } from '@/types';
import SvgIcon from '@/components/ui/SvgIcon.vue';

const $route = useRoute();
const $router = useRouter();
const { isMobile, isDesktop } = useResponsive();
const uiStore = useUIStore();


const leftDrawerOpen = ref(true);
const activeTab = ref('Cards');


const navigationItems: NavigationItem[] = [
  { name: 'Home', icon: 'home', route: '/home' },
  { name: 'Cards', icon: 'card', route: '/cards' },
  { name: 'Payments', icon: 'payments', route: '/payments' },
  { name: 'Credit', icon: 'credit', route: '/credit' },
  { name: 'Settings', icon: 'settings', route: '/settings' },
];


const mobileNavigationItems: NavigationItem[] = [
  { name: 'Home', icon: 'home', route: '/home' },
  { name: 'Cards', icon: 'card', route: '/cards' },
  { name: 'Pay', icon: 'payments', route: '/payments' },
  { name: 'Credit', icon: 'credit', route: '/credit' },
  { name: 'Profile', icon: 'settings', route: '/settings' },
];


watch(() => $route.name, (newRoute) => {
  if (newRoute) {
    activeTab.value = newRoute as string;
  }
});


watchEffect(() => {
  uiStore.setBreakpoint(isMobile.value, false, isDesktop.value);
});
</script>

<style scoped lang="scss">
@import '@/styles/utilities.scss';

.sidebar {
  background: #0c365a !important;
  color: var(--text-light);
  border-right: none;

  :deep(.q-drawer) {
    background: #0c365a !important;
  }

  :deep(*) {
    background-color: transparent;
  }

  .tagline {
    font-size: 0.875rem;
    color: #FFFFFF;
    opacity: 0.3;
    line-height: 1.5;
  }

  .navigation-menu {
    .nav-item {
      border-radius: var(--border-radius);
      color: rgba(255, 255, 255, 0.8);
      padding: var(--spacing-md) 0px;
      font-size: 16px;

      &.q-router-link--active {
        color: var(--color-secondary);
        font-weight: 600;
        box-shadow: none;
      }

      &:hover:not(.q-router-link--active) {
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-light);
      }

      .q-item-section--avatar {
        min-width: 40px;
      }

      .q-item-label {
        font-weight: 500;
      }
      
      .svg-icon:not(.svg-icon--active) {
        filter: brightness(0) saturate(100%) invert(1) !important;
      }
    }
  }
}

.main-container {
  background: var(--bg-primary);
}

.mobile-footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  overflow: hidden;

  .mobile-nav {
    height: 70px;
    width: 100%;
    overflow: hidden;

    .mobile-nav-tab {
      @include mobile-nav-tab;
    }
  }

  .svg-icon:not(.svg-icon--active) {
    filter: brightness(0) saturate(100%) invert(62%) sepia(4%) saturate(872%) hue-rotate(202deg) brightness(99%) contrast(85%) !important;
  }
}

@include mobile-and-tablet {
  .main-container {
    padding-bottom: 90px;
  }
}
</style>
