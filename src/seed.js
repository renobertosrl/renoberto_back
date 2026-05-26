import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User        from './models/User.js';
import Project     from './models/Project.js';
import Category    from './models/Category.js';
import Service     from './models/Service.js';
import Testimonial from './models/Testimonial.js';
import TeamMember  from './models/TeamMember.js';
import ProcessStep from './models/ProcessStep.js';
import Content     from './models/Content.js';
import Message     from './models/Message.js';

// Unsplash helper
const U = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

await connectDB();

const force = process.argv.includes('--force');
const existing = await Project.countDocuments();

if (existing > 0 && !force) {
  console.log(`Database already has ${existing} projects. Use --force to reseed.`);
  await mongoose.disconnect();
  process.exit(0);
}

console.log(force ? 'Force reseed — clearing data...' : 'Seeding fresh database...');

await Promise.all([
  Project.deleteMany({}),
  Category.deleteMany({}),
  Service.deleteMany({}),
  Testimonial.deleteMany({}),
  TeamMember.deleteMany({}),
  ProcessStep.deleteMany({}),
  Content.deleteMany({}),
  Message.deleteMany({}),
]);

// Admin user
const adminEmail = process.env.ADMIN_EMAIL || 'admin@renoberto.be';
const adminExists = await User.findOne({ email: adminEmail });
if (!adminExists) {
  await User.create({
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD || 'RenoBerto2024!',
    name: 'Roberto',
    role: 'admin',
  });
  console.log(`Admin créé : ${adminEmail}`);
} else {
  console.log(`Admin existant : ${adminEmail}`);
}

// ── Categories ──────────────────────────────────────────────────────────────
await Category.insertMany([
  { _id: 'carrelage',     name: 'Carrelage & Faïence' },
  { _id: 'peinture',      name: 'Peinture' },
  { _id: 'placo',         name: 'Placo / Cloisons' },
  { _id: 'parquet',       name: 'Parquet & Sols' },
  { _id: 'salle-de-bain', name: 'Salles de bain' },
]);

// ── Projects ─────────────────────────────────────────────────────────────────
await Project.insertMany([

  // 1 — SDB Ixelles (featured, avant/après)
  {
    title: 'Salle de bain suite parentale Ixelles',
    slug: 'salle-de-bain-ixelles',
    category: 'salle-de-bain', location: 'Ixelles', surface: 11, duration: '3 semaines', year: 2025,
    featured: true,
    summary: "Rénovation complète d'une salle de bain en suite parentale — grand format blanc mat, douche italienne, robinetterie noire.",
    description: "Démolition totale, reprise des évacuations, étanchéité sous carrelage, pose de carrelage 60×120 blanc mat, niche de douche en mosaïque, peinture finition satinée. Robinetterie noire brossé Grohe.",
    cover: U('1552321554-5fefe8c9ef14'),
    images: [
      U('1552321554-5fefe8c9ef14'),
      U('1620626011761-996317b8d101'),
      U('1604014237800-1c9102c219da'),
      U('1571514900-2c1b35d96e72'),
    ],
    materials: ['Carrelage 60×120 blanc mat', 'Robinetterie noire brossé Grohe', 'Receveur extra-plat Kaldewei', 'Peinture Farrow & Ball Dimpse'],
    beforeAfter: {
      before: U('1558618666-fcd25c85cd64'),
      after:  U('1552321554-5fefe8c9ef14'),
    },
    views: 1340,
  },

  // 2 — Cuisine carrelage Sablon (featured, avant/après)
  {
    title: 'Cuisine zellige & carreaux ciment Sablon',
    slug: 'cuisine-zellige-sablon',
    category: 'carrelage', location: 'Bruxelles · Sablon', surface: 18, duration: '3 semaines', year: 2025,
    featured: true,
    summary: "Crédence zellige fait-main vert émeraude, sol carreaux ciment géométriques, ouverture sur le séjour.",
    description: "Ouverture partielle du mur (pose d'un IPN), crédence en zellige marocain vert émeraude posé à la main, sol en carreaux de ciment authentiques motif géométrique, joints époxy gris perle.",
    cover: U('1556909114-f6e7ad7d3136'),
    images: [
      U('1556909114-f6e7ad7d3136'),
      U('1565538810643-b5bdb714032a'),
      U('1600585154526-990dced4db0d'),
      U('1556909114-44e3e9399a2e'),
    ],
    materials: ['Zellige 10×10 vert émeraude (Maroc)', 'Carreaux ciment géométriques', 'Joint époxy gris perle', 'IPN 120mm galvanisé'],
    beforeAfter: {
      before: U('1556228720-195a672e8a03'),
      after:  U('1556909114-f6e7ad7d3136'),
    },
    views: 2210,
  },

  // 3 — Parquet loft Bruxelles (featured, avant/après)
  {
    title: 'Parquet chêne massif loft canal',
    slug: 'parquet-chene-loft-canal',
    category: 'parquet', location: 'Molenbeek · Canal', surface: 94, duration: '5 semaines', year: 2025,
    featured: true,
    summary: "Pose de parquet chêne massif huilé sur 94m², ponçage des poutres apparentes, finitions béton ciré.",
    description: "Rénovation d'un loft dans une ancienne halle industrielle. Parquet chêne massif 180×20mm huilé mat posé flottant, béton ciré sur la cuisine et l'entrée, poutres métalliques poncées et peintes.",
    cover: U('1600585154340-be6161a56a0c'),
    images: [
      U('1600585154340-be6161a56a0c'),
      U('1600210492493-0946911123ea'),
      U('1600566753190-17f0baa2a6c3'),
      U('1600210491892-03d54c0aaf87'),
    ],
    materials: ['Chêne massif 180×20mm huilé', 'Béton ciré Mercadier gris perle', 'Huile dure Bona mat'],
    beforeAfter: {
      before: U('1502005229762-cf1b2da7c5d6'),
      after:  U('1600585154340-be6161a56a0c'),
    },
    views: 1870,
  },

  // 4 — SDB Rhode-Saint-Genèse (avant/après)
  {
    title: 'Salle de bain Rhode-Saint-Genèse',
    slug: 'salle-de-bain-rhode-saint-genese',
    category: 'salle-de-bain', location: 'Rhode-Saint-Genèse', surface: 8, duration: '2 semaines', year: 2025,
    featured: false,
    summary: "Réfection complète — carrelage métro blanc, meuble vasque suspendu, douche à l'italienne.",
    description: "Démolition et reconstruction complète. Pose de carrelage métro 7,5×15 blanc brillant, niche encastrée, meuble vasque chêne suspendu sur mesure, douche italienne avec paroi verre fumé.",
    cover: U('1620626011761-996317b8d101'),
    images: [
      U('1620626011761-996317b8d101'),
      U('1571514900-2c1b35d96e72'),
      U('1604014237800-1c9102c219da'),
    ],
    materials: ['Carrelage métro 7,5×15 blanc', 'Meuble vasque chêne suspendu', 'Paroi verre fumé 8mm'],
    beforeAfter: {
      before: U('1493809842364-78b498b3af2b'),
      after:  U('1620626011761-996317b8d101'),
    },
    views: 620,
  },

  // 5 — Peinture Waterloo (avant/après)
  {
    title: 'Rénovation peinture maison Waterloo',
    slug: 'peinture-maison-waterloo',
    category: 'peinture', location: 'Waterloo', surface: 180, duration: '2 semaines', year: 2025,
    featured: false,
    summary: "Peinture complète d'une maison 4 chambres — murs, plafonds, boiseries, palette nuancée.",
    description: "Préparation soignée des supports (rebouchage, ponçage, impression), deux couches de finition. Palette choisie ensemble : blancs chauds en séjour, vert sauge en cuisine, terracotta dans la chambre principale.",
    cover: U('1600607687939-ce8a6c25118c'),
    images: [
      U('1600607687939-ce8a6c25118c'),
      U('1615873968403-89e068629265'),
      U('1560560213-8cf4bf86a50d'),
    ],
    materials: ['Peinture Little Greene', 'Sous-couche universelle Zinsser', 'Enduit de lissage Knauf'],
    beforeAfter: {
      before: U('1558618666-fcd25c85cd64'),
      after:  U('1600607687939-ce8a6c25118c'),
    },
    views: 540,
  },

  // 6 — Carrelage Etterbeek
  {
    title: 'Pose carrelage grand format Etterbeek',
    slug: 'carrelage-grand-format-etterbeek',
    category: 'carrelage', location: 'Etterbeek', surface: 35, duration: '10 jours', year: 2024,
    featured: false,
    summary: "Sol en grès cérame grand format 80×80 effet béton, hall d'entrée et salon.",
    description: "Dépose du carrelage ancien, ragréage du support, pose de grès cérame 80×80 effet béton avec joints fins 2mm, plinthes assorties, finition joint époxy anthracite.",
    cover: U('1565538810643-b5bdb714032a'),
    images: [
      U('1565538810643-b5bdb714032a'),
      U('1556909114-44e3e9399a2e'),
      U('1600585154526-990dced4db0d'),
    ],
    materials: ['Grès cérame 80×80 effet béton', 'Joint époxy anthracite 2mm', 'Colle flexible C2TE'],
    beforeAfter: null,
    views: 387,
  },

  // 7 — Parquet Woluwe point de Hongrie
  {
    title: 'Parquet point de Hongrie Woluwe-Saint-Pierre',
    slug: 'parquet-point-de-hongrie-woluwe',
    category: 'parquet', location: 'Woluwe-Saint-Pierre', surface: 125, duration: '6 semaines', year: 2024,
    featured: false,
    summary: "Parquet chêne point de Hongrie sur deux niveaux, escalier sur mesure, vitrification mat.",
    description: "Pose de parquet en point de Hongrie chêne naturel sur 125m², collé sur chape anhydrite. Ponçage et vitrification mat Bona. Escalier en chêne massif sur mesure avec garde-corps fer forgé noir.",
    cover: U('1600210492493-0946911123ea'),
    images: [
      U('1600210492493-0946911123ea'),
      U('1600585154340-be6161a56a0c'),
      U('1600566753190-17f0baa2a6c3'),
    ],
    materials: ['Chêne point de Hongrie 140×14mm', 'Vitrificateur mat Bona Traffic HD', 'Colle MS-polymère'],
    beforeAfter: null,
    views: 910,
  },

  // 8 — Placo cloisons Forest
  {
    title: 'Cloisons & mezzanine Forest',
    slug: 'cloisons-mezzanine-forest',
    category: 'placo', location: 'Forest / Vorst', surface: 42, duration: '3 semaines', year: 2025,
    featured: false,
    summary: "Création d'une mezzanine en BA18 et de cloisons acoustiques dans un appartement duplex.",
    description: "Conception et construction d'une mezzanine accessible par escalier droit, cloisons phoniques BA13 + laine de roche 100mm, faux-plafond avec éclairage encastré LED, peinture blanche finition mate.",
    cover: U('1615873968403-89e068629265'),
    images: [
      U('1615873968403-89e068629265'),
      U('1600210491892-03d54c0aaf87'),
    ],
    materials: ['BA18 mezzanine', 'BA13 cloison phonique', 'Laine de roche 100mm', 'Spots LED encastrés Philips'],
    beforeAfter: null,
    views: 298,
  },

  // 9 — Peinture Braine-l'Alleud (avant/après)
  {
    title: 'Peinture appartement Braine-l\'Alleud',
    slug: 'peinture-appartement-braine-lalleud',
    category: 'peinture', location: "Braine-l'Alleud", surface: 72, duration: '8 jours', year: 2024,
    featured: false,
    summary: "Remise en état peinture complète avant mise en location — murs, plafonds, boiseries.",
    description: "Préparation des supports, rebouchage fissurations, ponçage, impression, deux couches finition blanc cassé satiné. Boiseries laquées blanc pur. Travaux réalisés en 8 jours calendrier.",
    cover: U('1560560213-8cf4bf86a50d'),
    images: [
      U('1560560213-8cf4bf86a50d'),
      U('1600607687939-ce8a6c25118c'),
    ],
    materials: ['Peinture Tollens satiné blanc cassé', 'Laque alkyde blanc pur boiseries', 'Enduit Toupret'],
    beforeAfter: {
      before: U('1493809842364-78b498b3af2b'),
      after:  U('1560560213-8cf4bf86a50d'),
    },
    views: 215,
  },

  // 10 — SDB Uccle terrazzo
  {
    title: 'Salle de bain terrazzo Uccle',
    slug: 'salle-de-bain-terrazzo-uccle',
    category: 'salle-de-bain', location: 'Uccle', surface: 9, duration: '3 semaines', year: 2024,
    featured: false,
    summary: "SDB intemporelle — terrazzo grand format, baignoire îlot, vasque en béton sur mesure.",
    description: "Sol et mur en terrazzo 80×80 blanc et gris, baignoire îlot autoportante Bette, vasque coulée en béton ciré sur mesure, robinetterie dorée brossé, niche encastrée éclairée.",
    cover: U('1604014237800-1c9102c219da'),
    images: [
      U('1604014237800-1c9102c219da'),
      U('1620626011761-996317b8d101'),
      U('1571514900-2c1b35d96e72'),
    ],
    materials: ['Terrazzo 80×80 blanc/gris', 'Baignoire îlot Bette', 'Vasque béton ciré sur mesure', 'Robinetterie dorée brossé'],
    beforeAfter: null,
    views: 760,
  },

  // 11 — Carrelage salle de bain Schaerbeek (avant/après)
  {
    title: 'Rénovation salle de bain Schaerbeek',
    slug: 'salle-de-bain-schaerbeek',
    category: 'salle-de-bain', location: 'Schaerbeek', surface: 6, duration: '10 jours', year: 2024,
    featured: false,
    summary: "Petite SDB optimisée — carrelage hexagonal, colonne de douche, miroir avec éclairage intégré.",
    description: "Dans une surface contrainte de 6m², optimisation complète : carrelage hexagonal blanc/noir au sol, grand format 30×60 aux murs, colonne de douche thermostatique, miroir LED anti-buée.",
    cover: U('1571514900-2c1b35d96e72'),
    images: [
      U('1571514900-2c1b35d96e72'),
      U('1604014237800-1c9102c219da'),
    ],
    materials: ['Mosaïque hexagonale blanc/noir', 'Carrelage 30×60 gris clair', 'Colonne douche thermostatique Grohe', 'Miroir LED anti-buée'],
    beforeAfter: {
      before: U('1558618666-fcd25c85cd64'),
      after:  U('1571514900-2c1b35d96e72'),
    },
    views: 480,
  },

  // 12 — Carrelage cuisine Jette
  {
    title: 'Cuisine & dosseret Jette',
    slug: 'cuisine-dosseret-jette',
    category: 'carrelage', location: 'Jette', surface: 15, duration: '1 semaine', year: 2024,
    featured: false,
    summary: "Dosseret en carrelage métro, sol en carreaux de ciment et joints colorés.",
    description: "Dépose du carrelage existant, pose d'un dosseret métro blanc 7,5×15 avec joint noir, sol en carreaux de ciment bleu nuit 20×20, rénovation des meubles de cuisine (peinture laque).",
    cover: U('1556909114-44e3e9399a2e'),
    images: [
      U('1556909114-44e3e9399a2e'),
      U('1556909114-f6e7ad7d3136'),
    ],
    materials: ['Carrelage métro 7,5×15 blanc', 'Carreaux ciment bleu nuit 20×20', 'Joint époxy noir', 'Laque meuble cuisine'],
    beforeAfter: null,
    views: 190,
  },

]);

// ── Services ─────────────────────────────────────────────────────────────────
await Service.insertMany([
  { cat: 'carrelage',     title: 'Carrelage & Faïence',       desc: 'Sols, murs, douches italiennes, crédences. Pose droite, diagonale, chevrons, mosaïques, grand format. Préparation du support et joints époxy.',  price: 'À partir de 65€/m²',  order: 0 },
  { cat: 'peinture',      title: 'Peinture intérieure',       desc: 'Murs, plafonds, boiseries. Préparation soignée (rebouchage, ponçage), peintures écologiques sur demande. Finitions mat, satiné, laqué.',            price: 'À partir de 28€/m²',  order: 1 },
  { cat: 'placo',         title: 'Placo & cloisons',          desc: 'Cloisons sèches, doublages thermiques et acoustiques, faux-plafonds, mezzanines. Nous travaillons sur plan ou à partir de votre idée.',             price: 'À partir de 45€/m²',  order: 2 },
  { cat: 'parquet',       title: 'Parquet & sols',            desc: 'Parquet massif ou contrecollé, pose collée, clouée ou flottante. Ponçage, vitrification, huilage. Béton ciré et sols souples sur demande.',          price: 'À partir de 55€/m²',  order: 3 },
  { cat: 'salle-de-bain', title: 'Salles de bain complètes',  desc: 'Rénovation clé en main — démolition, plomberie, électricité, carrelage, peinture, mobilier. Douches italiennes, baignoires îlot, vasques sur mesure.', price: 'À partir de 6 500€', order: 4 },
]);

// ── Testimonials ──────────────────────────────────────────────────────────────
await Testimonial.insertMany([
  {
    quote: "Roberto et son équipe ont transformé notre salle de bain vieillissante en quelque chose d'absolument magnifique. Travail soigné, chantier propre, délais respectés. On recommande sans hésiter.",
    name: 'Caroline & Marc D.', location: 'Ixelles',
  },
  {
    quote: "Très bon contact, écoute des besoins, conseils pertinents sur les matériaux. Le résultat dépasse nos attentes. Le zellige de notre cuisine est juste splendide.",
    name: 'Julien R.', location: 'Bruxelles · Sablon',
  },
  {
    quote: "Devis clair, pas de mauvaises surprises, livraison en temps et en heure. C'est rare dans le secteur. Merci à Vasi pour son travail impeccable sur le parquet.",
    name: 'Famille Lambert', location: 'Waterloo',
  },
  {
    quote: "Kostea a refait notre salle de bain en 10 jours chrono, avec un soin du détail remarquable. Le carrelage hexagonal est parfaitement posé, joint après joint.",
    name: 'Émilie V.', location: 'Schaerbeek',
  },
  {
    quote: "J'ai contacté plusieurs entreprises, Renoberto est la seule qui m'a répondu rapidement et proposé une vraie visite avant devis. Le travail est à la hauteur.",
    name: 'Antoine L.', location: "Braine-l'Alleud",
  },
  {
    quote: "Peinture de toute la maison en deux semaines, palette choisie avec Roberto qui a de vraies connaissances en décoration. Résultat chaleureux et professionnel.",
    name: 'Sophie M.', location: 'Woluwe-Saint-Pierre',
  },
]);

// ── Team ─────────────────────────────────────────────────────────────────────
await TeamMember.insertMany([
  {
    name: 'Roberto',
    role: 'Fondateur · Chef de chantier',
    photo: U('1560250097-0b93528c311a'),
    order: 0,
  },
  {
    name: 'Vasile (Vasi)',
    role: 'Carreleur · Parqueteur',
    photo: U('1507003211169-0a1dd7228f2d'),
    order: 1,
  },
  {
    name: 'Constantin (Kostea)',
    role: 'Peintre · Plaquiste',
    photo: U('1521119989659-a83eee488004'),
    order: 2,
  },
]);

// ── Process ───────────────────────────────────────────────────────────────────
await ProcessStep.insertMany([
  {
    title: 'Premier contact',
    desc: "Appelez-nous, envoyez un message ou remplissez le formulaire. Nous vous rappelons sous 24h pour fixer une visite gratuite à votre domicile.",
    order: 0,
  },
  {
    title: 'Visite & mesures',
    desc: "Roberto ou l'un des artisans vient sur place. Prise de mesures, écoute de votre projet, conseils sur les matériaux et les couleurs — sans engagement.",
    order: 1,
  },
  {
    title: 'Devis détaillé',
    desc: "Vous recevez un devis ligne par ligne sous 7 jours. Prix ferme, pas de frais cachés. On répond à toutes vos questions avant signature.",
    order: 2,
  },
  {
    title: 'Chantier',
    desc: "On démarre à la date convenue. Un seul interlocuteur du début à la fin. Chantier propre, photos envoyées régulièrement, respect des voisins.",
    order: 3,
  },
  {
    title: 'Livraison',
    desc: "Réception des travaux ensemble, retouches éventuelles traitées sous 7 jours. Garantie décennale remise à la livraison.",
    order: 4,
  },
]);

// ── Content ───────────────────────────────────────────────────────────────────
await Content.create({
  _id: 'main',
  heroImage: U('1552321554-5fefe8c9ef14'),
  about: {
    title: "Un travail soigné, livré dans les temps.",
    body: "Renoberto, c'est l'histoire de Roberto — artisan du bâtiment passionné par le travail bien fait. Après plus de dix ans sur les chantiers bruxellois pour le compte d'autres entreprises, il a fondé Renoberto en 2024 avec une idée simple : proposer des finitions de qualité, sans mauvaises surprises, avec une vraie relation de confiance.\n\n**Trois artisans, une vision commune.** Roberto, Vasi et Kostea interviennent ensemble sur chaque projet — carrelage, peinture, placo, parquet. Pas de sous-traitance, pas d'intermédiaires. Vous avez un interlocuteur unique du premier coup de marteau jusqu'à la remise des clés.\n\nNous intervenons sur **tout Bruxelles et le Brabant wallon** — à domicile, en appartement, en maison, en commerce. Devis gratuit sous 7 jours après visite.",
    image: U('1581094271901-8022df4466f9'),
  },
  contact: {
    phone:     '+32 497 12 29 60',
    whatsapp:  '+32 497 12 29 60',
    email:     'renobertosrl@gmail.com',
    address:   'Bruxelles & Brabant wallon',
    city:      'Interventions à domicile — pas de showroom',
    hours:     'Lun – Sam · 7h30 – 18h',
    instagram: '@renoberto.be',
  },
});

// ── Sample messages ───────────────────────────────────────────────────────────
await Message.insertMany([
  {
    name: 'Sophie Martens', email: 'sophie.m@gmail.com', phone: '+32 478 12 34 56',
    subject: 'Demande de devis salle de bain',
    body: "Bonjour, je voudrais rénover ma salle de bain d'environ 7m² à Ixelles. Quand pourriez-vous passer pour une visite ?",
    read: false,
  },
  {
    name: 'Pierre Dubois', email: 'pdubois@telenet.be', phone: '+32 488 22 11 04',
    subject: 'Pose parquet ~55m²',
    body: "Bonjour, je suis intéressé par une pose de parquet chêne dans mon salon et ma salle à manger. Surface totale environ 55m². Disponible en semaine.",
    read: false,
  },
  {
    name: 'Nathalie Renard', email: 'nat.renard@proximus.be', phone: '+32 477 66 44 22',
    subject: 'Cuisine — crédence carrelage',
    body: "Suite à notre appel, pouvez-vous me confirmer le devis pour la crédence en métro et le sol en carreaux de ciment ? Merci.",
    read: true,
  },
  {
    name: 'Laurent B.', email: 'lb.renovation@outlook.com', phone: '+32 499 77 55 33',
    subject: 'Peinture appartement complet',
    body: "Bonjour, je souhaite faire peindre un appartement 2 chambres de 65m² à Etterbeek avant de le louer. Est-ce que vous intervenez aussi pour les bailleurs ?",
    read: true,
  },
]);

await mongoose.disconnect();
console.log('✓ Seed terminé avec succès');
process.exit(0);
