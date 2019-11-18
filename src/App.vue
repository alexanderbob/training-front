<template>
  <v-app>
    <v-app-bar app clipped-left v-if="$vuetify.breakpoint.xsOnly" hide-on-scroll>
      <v-toolbar-title>YOBA</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn href="/" v-on:click.stop.prevent="handleClick"><v-icon>mdi-monitor-dashboard</v-icon></v-btn>
        <v-btn href="/Weightlifting" v-on:click.stop.prevent="handleClick"><v-icon>mdi-weight-lifter</v-icon></v-btn>
        <v-btn href="/Cycling" disabled v-on:click.stop.prevent="handleClick"><v-icon>mdi-bike</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-app-bar v-else app clipped-left>
      <v-toolbar-title>YOBA</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn href="/" v-on:click.stop.prevent="handleClick"><v-icon>mdi-monitor-dashboard</v-icon> Dashboard</v-btn>
        <v-btn href="/Weightlifting" v-on:click.stop.prevent="handleClick"><v-icon>mdi-weight-lifter</v-icon> Weightlifting</v-btn>
        <v-btn href="/Cycling" disabled v-on:click.stop.prevent="handleClick"><v-icon>mdi-bike</v-icon> Cycling</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      
        <router-view />
      
    </v-content>

    <v-footer app>
      <span>&copy; {{ thisYear }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import router from './router';

@Component
class App extends Vue {
  private drawer: boolean;
  constructor() {
      super();
      this.drawer = false;
  }

  get thisYear() {
    return new Date().getFullYear();
  }

  navbarClick() {
    this.drawer = !this.drawer;
  }

  handleClick(e: MouseEvent) {
    //
    if (e.currentTarget != null)
    {
      router.push((e.currentTarget as HTMLElement).getAttribute("href") || "");
    }
  }
}

export default App;
</script>