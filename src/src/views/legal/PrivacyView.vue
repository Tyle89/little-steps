<!--
  Static GDPR privacy policy page (data collected, purpose, storage,
  retention, user rights, contact). Reachable before signing up (linked
  from the register form) and from the app footer.
-->
<template>
  <div class="privacy-page">
    <div class="content">
      <h1 class="title">Politique de confidentialité</h1>
      <p class="updated">Dernière mise à jour : {{ today }}</p>

      <div class="card">
        <h3>Quelles données sont collectées ?</h3>
        <ul>
          <li>Ton adresse email et ton prénom (pour la création de ton compte)</li>
          <li>Les informations de ton enfant que tu renseignes toi-même : prénom, date de naissance, genre, poids, taille, photo, jalons de développement</li>
          <li>Tes entrées de journal d'humeur (emoji, tags, notes libres)</li>
        </ul>
      </div>

      <div class="card">
        <h3>Pourquoi ces données ?</h3>
        <p>
          Uniquement pour faire fonctionner l'application : afficher le profil de ton enfant,
          calculer son âge, tracer ses courbes de croissance et te permettre de suivre ton
          propre bien-être. Aucune donnée n'est utilisée à des fins publicitaires, aucune
          revente à des tiers.
        </p>
      </div>

      <div class="card">
        <h3>Où sont stockées les données ?</h3>
        <p>
          Sur les serveurs de Google Firebase (Cloud Firestore), avec des règles de sécurité
          garantissant que seul ton compte peut lire ou modifier tes propres données.
        </p>
      </div>

      <div class="card">
        <h3>Combien de temps sont-elles conservées ?</h3>
        <p>
          Tant que ton compte existe. Tu peux les supprimer intégralement et définitivement
          à tout moment depuis la page "Enfant" de l'application.
        </p>
      </div>

      <div class="card">
        <h3>Tes droits</h3>
        <ul>
          <li><strong>Accès</strong> : tu peux consulter toutes tes données directement dans l'application</li>
          <li><strong>Rectification</strong> : tu peux modifier tes informations à tout moment</li>
          <li><strong>Effacement</strong> : le bouton "Supprimer mon compte" efface définitivement tes données et ton compte</li>
          <li><strong>Portabilité</strong> : pour toute demande d'export, contacte-nous à l'adresse ci-dessous</li>
        </ul>
      </div>

      <div class="card">
        <h3>Contact</h3>
        <p>
          Pour toute question relative à tes données personnelles, tu peux nous écrire à :
          <strong>contact@little-steps.app</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// "Last updated" date, always today's date. This is a simple placeholder
// - a real deployment would want a fixed date that only changes when the
// policy text itself is actually edited.
const today = new Date().toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding: 30px 20px;
}

.content {
  max-width: 650px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #5C4033;
  margin-bottom: 4px;
}

.updated {
  text-align: center;
  color: #8C6F5E;
  font-size: 0.85rem;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 22px 24px;
  margin-bottom: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.card h3 {
  color: #5C4033;
  margin: 0 0 12px;
}

.card p, .card li {
  color: #6b5847;
  line-height: 1.6;
}

.card ul {
  padding-left: 20px;
  margin: 0;
}

.card li {
  margin-bottom: 6px;
}
</style>