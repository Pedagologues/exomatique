<script>
  import { LightSwitch } from '@skeletonlabs/skeleton';
  import { AppBar } from '@skeletonlabs/skeleton';
  import "../app.css";
</script>

<div>
  <AppBar>
    <svelte:fragment slot="lead">
        Exomatique  
    </svelte:fragment>

    <div class="flex flex-column gap-x-4 justify-around grow">
    </div>
    <svelte:fragment slot="trail">
      <LightSwitch />
    </svelte:fragment>
  </AppBar>
  <slot />
</div>