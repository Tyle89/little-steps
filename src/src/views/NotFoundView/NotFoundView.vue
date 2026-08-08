<!--
  Basic 404 placeholder. NOTE: not currently wired up - there is no
  catch-all/wildcard route in router/index.js pointing to it, so an
  invalid URL falls through to a blank screen instead of this page. Would
  need a route like { path: '/:pathMatch(.*)*', component: NotFoundView }
  to actually be used.
-->
<template>
  <div>404 - Page not found</div>
</template>
