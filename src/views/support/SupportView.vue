<template>
  <div class="support-page">
    <div class="content">
      <h1 class="title">Besoin de parler ? 💚</h1>
      <p class="intro">
        Être parent, c'est aussi traverser des moments difficiles, des doutes,
        de la fatigue, parfois de l'épuisement. Ce n'est ni une faiblesse ni un échec —
        et tu n'as pas à porter ça seul(e). Voici des personnes formées pour t'écouter,
        gratuitement et en toute confidentialité.
      </p>

      <div class="card resource-card" v-for="resource in resources" :key="resource.name">
        <div class="resource-header">
          <span class="resource-icon">{{ resource.icon }}</span>
          <div>
            <h3>{{ resource.name }}</h3>
            <a :href="`tel:${resource.phoneLink}`" class="phone">{{ resource.phone }}</a>
          </div>
        </div>
        <p class="resource-desc">{{ resource.description }}</p>
      </div>

      <div class="card emergency-card">
        <p>
          🚨 En cas de danger immédiat pour toi-même ou ton enfant, appelle le
          <strong>112</strong> (urgences) ou le <strong>101</strong> (police).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const resources = [
  {
    icon: '🤱',
    name: 'SOS Parents',
    phone: '0471 41 43 33',
    phoneLink: '0471414333',
    description: "Ligne dédiée spécifiquement à l'épuisement et au burn-out parental, créée par deux chercheuses spécialistes du sujet (UCLouvain). Une équipe de psychologues répond."
  },
  {
    icon: '☎️',
    name: 'Télé-Accueil',
    phone: '107',
    phoneLink: '107',
    description: "Écoute générale, anonyme et gratuite, 24h/24 et 7j/7, pour toute personne traversant une difficulté morale, sociale ou psychologique."
  },
  {
    icon: '💙',
    name: 'Centre de Prévention du Suicide',
    phone: '0800 32 123',
    phoneLink: '0800321213',
    description: "Écoute anonyme 24h/24 pour toute personne en détresse, ou pour un proche inquiet."
  },
  {
    icon: '👂',
    name: '103 Écoute',
    phone: '103',
    phoneLink: '103',
    description: "Destinée aux enfants et ados, mais aussi ouverte aux adultes en difficulté dans leur rôle éducatif."
  },
  {
    icon: '🛡️',
    name: 'Écoute Violences Conjugales',
    phone: '0800 30 030',
    phoneLink: '0800300 30',
    description: "Pour les victimes ou témoins de violence conjugale."
  }
]
</script>

<style scoped>
.support-page {
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
  margin-bottom: 16px;
}

.intro {
  text-align: center;
  color: #6b5847;
  line-height: 1.6;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 22px 24px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.resource-icon {
  font-size: 2rem;
}

.resource-header h3 {
  margin: 0 0 2px;
  color: #5C4033;
}

.phone {
  color: #9ED8B6;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
}

.resource-desc {
  color: #8C6F5E;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.emergency-card {
  background: #fdecea;
  text-align: center;
}

.emergency-card p {
  color: #c0392b;
  margin: 0;
}
</style>