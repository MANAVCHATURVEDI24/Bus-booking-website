import { Injectable, ApplicationRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LanguageService } from './language.service';

interface Translations {
  [key: string]: {
    [language: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translationsSubject = new BehaviorSubject<any>({});
  public translations$ = this.translationsSubject.asObservable();
  private currentTranslations: any = {};

  private translations: Translations = {
    // Navigation
    'nav.busTickets': {
      'en': 'Bus Tickets',
      'es': 'Boletos de Autobús',
      'fr': 'Billets de Bus',
      'de': 'Bustickets',
      'pt': 'Passagens de Ônibus',
      'it': 'Biglietti Autobus'
    },
    'nav.community': {
      'en': 'Community',
      'es': 'Comunidad',
      'fr': 'Communauté',
      'de': 'Gemeinschaft',
      'pt': 'Comunidade',
      'it': 'Comunità'
    },
    'nav.cabRental': {
      'en': 'Cab Rental',
      'es': 'Alquiler de Taxi',
      'fr': 'Location de Taxi',
      'de': 'Taxi-Vermietung',
      'pt': 'Aluguel de Táxi',
      'it': 'Noleggio Taxi'
    },
    'nav.trainTickets': {
      'en': 'Train Tickets',
      'es': 'Boletos de Tren',
      'fr': 'Billets de Train',
      'de': 'Zugtickets',
      'pt': 'Passagens de Trem',
      'it': 'Biglietti Treno'
    },
    'nav.home': {
      'en': 'Home',
      'es': 'Inicio',
      'fr': 'Accueil',
      'de': 'Startseite',
      'pt': 'Início',
      'it': 'Home'
    },
    'nav.profile': {
      'en': 'Profile',
      'es': 'Perfil',
      'fr': 'Profil',
      'de': 'Profil',
      'pt': 'Perfil',
      'it': 'Profilo'
    },
    'nav.myTrips': {
      'en': 'My Trips',
      'es': 'Mis Viajes',
      'fr': 'Mes Voyages',
      'de': 'Meine Reisen',
      'pt': 'Minhas Viagens',
      'it': 'I Miei Viaggi'
    },
    'nav.help': {
      'en': 'Help',
      'es': 'Ayuda',
      'fr': 'Aide',
      'de': 'Hilfe',
      'pt': 'Ajuda',
      'it': 'Aiuto'
    },
    'nav.account': {
      'en': 'Account',
      'es': 'Cuenta',
      'fr': 'Compte',
      'de': 'Konto',
      'pt': 'Conta',
      'it': 'Account'
    },
    'nav.wallet': {
      'en': 'Wallet/Cards',
      'es': 'Billetera/Tarjetas',
      'fr': 'Portefeuille/Cartes',
      'de': 'Geldbörse/Karten',
      'pt': 'Carteira/Cartões',
      'it': 'Portafoglio/Carte'
    },
    'nav.signOut': {
      'en': 'Sign Out',
      'es': 'Cerrar Sesión',
      'fr': 'Se Déconnecter',
      'de': 'Abmelden',
      'pt': 'Sair',
      'it': 'Esci'
    },

    // Landing Page
    'landing.heroTitle': {
      'en': 'India\'s No. 1 Online Bus Ticket Booking Site',
      'es': 'Sitio de Reserva de Boletos de Autobús en Línea No. 1 de India',
      'fr': 'Site de Réservation de Billets de Bus en Ligne No. 1 de l\'Inde',
      'de': 'Indiens Nr. 1 Online-Busticket-Buchungsseite',
      'pt': 'Site de Reserva de Passagens de Ônibus Online No. 1 da Índia',
      'it': 'Sito di Prenotazione Biglietti Autobus Online No. 1 dell\'India'
    },

    // Search Form
    'search.from': {
      'en': 'From',
      'es': 'Desde',
      'fr': 'De',
      'de': 'Von',
      'pt': 'De',
      'it': 'Da'
    },
    'search.to': {
      'en': 'To',
      'es': 'Hasta',
      'fr': 'À',
      'de': 'Nach',
      'pt': 'Para',
      'it': 'A'
    },
    'search.departure': {
      'en': 'Departure',
      'es': 'Salida',
      'fr': 'Départ',
      'de': 'Abfahrt',
      'pt': 'Partida',
      'it': 'Partenza'
    },
    'search.searchBuses': {
      'en': 'Search Buses',
      'es': 'Buscar Autobuses',
      'fr': 'Rechercher des Bus',
      'de': 'Busse Suchen',
      'pt': 'Buscar Ônibus',
      'it': 'Cerca Autobus'
    },

    // Bus Listing
    'bus.rating': {
      'en': 'Rating',
      'es': 'Calificación',
      'fr': 'Note',
      'de': 'Bewertung',
      'pt': 'Avaliação',
      'it': 'Valutazione'
    },
    'bus.reviews': {
      'en': 'reviews',
      'es': 'reseñas',
      'fr': 'avis',
      'de': 'Bewertungen',
      'pt': 'avaliações',
      'it': 'recensioni'
    },
    'bus.viewReviews': {
      'en': 'View Reviews',
      'es': 'Ver Reseñas',
      'fr': 'Voir les Avis',
      'de': 'Bewertungen Anzeigen',
      'pt': 'Ver Avaliações',
      'it': 'Visualizza Recensioni'
    },
    'bus.seatsAvailable': {
      'en': 'Seats Available',
      'es': 'Asientos Disponibles',
      'fr': 'Sièges Disponibles',
      'de': 'Verfügbare Plätze',
      'pt': 'Assentos Disponíveis',
      'it': 'Posti Disponibili'
    },
    'bus.window': {
      'en': 'Window',
      'es': 'Ventana',
      'fr': 'Fenêtre',
      'de': 'Fenster',
      'pt': 'Janela',
      'it': 'Finestrino'
    },

    // Reviews
    'review.customerReviews': {
      'en': 'Customer Reviews',
      'es': 'Reseñas de Clientes',
      'fr': 'Avis Clients',
      'de': 'Kundenbewertungen',
      'pt': 'Avaliações de Clientes',
      'it': 'Recensioni Clienti'
    },
    'review.writeReview': {
      'en': 'Write Review',
      'es': 'Escribir Reseña',
      'fr': 'Écrire un Avis',
      'de': 'Bewertung Schreiben',
      'pt': 'Escrever Avaliação',
      'it': 'Scrivi Recensione'
    },
    'review.punctuality': {
      'en': 'Punctuality',
      'es': 'Puntualidad',
      'fr': 'Ponctualité',
      'de': 'Pünktlichkeit',
      'pt': 'Pontualidade',
      'it': 'Puntualità'
    },
    'review.cleanliness': {
      'en': 'Cleanliness',
      'es': 'Limpieza',
      'fr': 'Propreté',
      'de': 'Sauberkeit',
      'pt': 'Limpeza',
      'it': 'Pulizia'
    },
    'review.comfort': {
      'en': 'Comfort',
      'es': 'Comodidad',
      'fr': 'Confort',
      'de': 'Komfort',
      'pt': 'Conforto',
      'it': 'Comfort'
    },
    'review.staff': {
      'en': 'Staff',
      'es': 'Personal',
      'fr': 'Personnel',
      'de': 'Personal',
      'pt': 'Equipe',
      'it': 'Staff'
    },
    'review.value': {
      'en': 'Value',
      'es': 'Valor',
      'fr': 'Valeur',
      'de': 'Wert',
      'pt': 'Valor',
      'it': 'Valore'
    },
    'review.helpful': {
      'en': 'Helpful',
      'es': 'Útil',
      'fr': 'Utile',
      'de': 'Hilfreich',
      'pt': 'Útil',
      'it': 'Utile'
    },
    'review.journey': {
      'en': 'Journey',
      'es': 'Viaje',
      'fr': 'Voyage',
      'de': 'Reise',
      'pt': 'Viagem',
      'it': 'Viaggio'
    },
    'review.noReviews': {
      'en': 'No reviews yet. Be the first to review this route!',
      'es': '¡Aún no hay reseñas. ¡Sé el primero en reseñar esta ruta!',
      'fr': 'Pas encore d\'avis. Soyez le premier à évaluer cette route !',
      'de': 'Noch keine Bewertungen. Seien Sie der Erste, der diese Route bewertet!',
      'pt': 'Ainda não há avaliações. Seja o primeiro a avaliar esta rota!',
      'it': 'Nessuna recensione ancora. Sii il primo a recensire questa rotta!'
    },
    'review.showMore': {
      'en': 'Show All Reviews',
      'es': 'Mostrar Todas las Reseñas',
      'fr': 'Afficher Tous les Avis',
      'de': 'Alle Bewertungen Anzeigen',
      'pt': 'Mostrar Todas as Avaliações',
      'it': 'Mostra Tutte le Recensioni'
    },
    'review.showLess': {
      'en': 'Show Less',
      'es': 'Mostrar Menos',
      'fr': 'Afficher Moins',
      'de': 'Weniger Anzeigen',
      'pt': 'Mostrar Menos',
      'it': 'Mostra Meno'
    },

    // Common
    'common.loading': {
      'en': 'Loading...',
      'es': 'Cargando...',
      'fr': 'Chargement...',
      'de': 'Laden...',
      'pt': 'Carregando...',
      'it': 'Caricamento...'
    },
    'common.submit': {
      'en': 'Submit',
      'es': 'Enviar',
      'fr': 'Soumettre',
      'de': 'Einreichen',
      'pt': 'Enviar',
      'it': 'Invia'
    },
    'common.cancel': {
      'en': 'Cancel',
      'es': 'Cancelar',
      'fr': 'Annuler',
      'de': 'Abbrechen',
      'pt': 'Cancelar',
      'it': 'Annulla'
    },
    'common.close': {
      'en': 'Close',
      'es': 'Cerrar',
      'fr': 'Fermer',
      'de': 'Schließen',
      'pt': 'Fechar',
      'it': 'Chiudi'
    },

    // Dark Mode
    'theme.darkMode': {
      'en': 'Dark Mode',
      'es': 'Modo Oscuro',
      'fr': 'Mode Sombre',
      'de': 'Dunkler Modus',
      'pt': 'Modo Escuro',
      'it': 'Modalità Scura'
    },
    'theme.lightMode': {
      'en': 'Light Mode',
      'es': 'Modo Claro',
      'fr': 'Mode Clair',
      'de': 'Heller Modus',
      'pt': 'Modo Claro',
      'it': 'Modalità Chiara'
    },

    // Language
    'language.select': {
      'en': 'Select Language',
      'es': 'Seleccionar Idioma',
      'fr': 'Sélectionner la Langue',
      'de': 'Sprache Auswählen',
      'pt': 'Selecionar Idioma',
      'it': 'Seleziona Lingua'
    },

    // Offers Section
    'offers.trending': {
      'en': 'TRENDING OFFERS',
      'es': 'OFERTAS DESTACADAS',
      'fr': 'OFFRES TENDANCE',
      'de': 'TRENDING ANGEBOTE',
      'pt': 'OFERTAS EM DESTAQUE',
      'it': 'OFFERTE DI TENDENZA'
    },
    'offers.viewAll': {
      'en': 'View All',
      'es': 'Ver Todo',
      'fr': 'Voir Tout',
      'de': 'Alle Anzeigen',
      'pt': 'Ver Tudo',
      'it': 'Vedi Tutto'
    },
    'offers.bus': {
      'en': 'BUS',
      'es': 'AUTOBÚS',
      'fr': 'BUS',
      'de': 'BUS',
      'pt': 'ÔNIBUS',
      'it': 'AUTOBUS'
    },
    'offers.save250': {
      'en': 'Save up to Rs 250 on bus tickets',
      'es': 'Ahorra hasta Rs 250 en boletos de autobús',
      'fr': 'Économisez jusqu\'à Rs 250 sur les billets de bus',
      'de': 'Sparen Sie bis zu Rs 250 bei Bustickets',
      'pt': 'Economize até Rs 250 em passagens de ônibus',
      'it': 'Risparmia fino a Rs 250 sui biglietti dell\'autobus'
    },
    'offers.save300': {
      'en': 'Save up to Rs 300 on AP, TS routes',
      'es': 'Ahorra hasta Rs 300 en rutas AP, TS',
      'fr': 'Économisez jusqu\'à Rs 300 sur les routes AP, TS',
      'de': 'Sparen Sie bis zu Rs 300 auf AP, TS Routen',
      'pt': 'Economize até Rs 300 em rotas AP, TS',
      'it': 'Risparmia fino a Rs 300 sulle rotte AP, TS'
    },
    'offers.save300RJ': {
      'en': 'Save up to Rs 300 on RJ, MH, Goa, MP',
      'es': 'Ahorra hasta Rs 300 en RJ, MH, Goa, MP',
      'fr': 'Économisez jusqu\'à Rs 300 sur RJ, MH, Goa, MP',
      'de': 'Sparen Sie bis zu Rs 300 auf RJ, MH, Goa, MP',
      'pt': 'Economize até Rs 300 em RJ, MH, Goa, MP',
      'it': 'Risparmia fino a Rs 300 su RJ, MH, Goa, MP'
    },
    'offers.save200': {
      'en': 'Save up to Rs 200 in Kerala routes',
      'es': 'Ahorra hasta Rs 200 en rutas de Kerala',
      'fr': 'Économisez jusqu\'à Rs 200 sur les routes du Kerala',
      'de': 'Sparen Sie bis zu Rs 200 auf Kerala-Routen',
      'pt': 'Economize até Rs 200 em rotas de Kerala',
      'it': 'Risparmia fino a Rs 200 sulle rotte del Kerala'
    },
    'offers.validTill': {
      'en': 'Valid till 30 Nov',
      'es': 'Válido hasta el 30 de Nov',
      'fr': 'Valable jusqu\'au 30 Nov',
      'de': 'Gültig bis 30. Nov',
      'pt': 'Válido até 30 de Nov',
      'it': 'Valido fino al 30 Nov'
    },

    // Route Planning Section
    'route.title': {
      'en': 'Interactive Route Planning',
      'es': 'Planificación Interactiva de Rutas',
      'fr': 'Planification Interactive d\'Itinéraire',
      'de': 'Interaktive Routenplanung',
      'pt': 'Planejamento Interativo de Rotas',
      'it': 'Pianificazione Interattiva del Percorso'
    },
    'route.subtitle': {
      'en': 'Plan your perfect journey with real-time traffic updates and smart route optimization',
      'es': 'Planifica tu viaje perfecto con actualizaciones de tráfico en tiempo real y optimización inteligente de rutas',
      'fr': 'Planifiez votre voyage parfait avec des mises à jour du trafic en temps réel et une optimisation intelligente des itinéraires',
      'de': 'Planen Sie Ihre perfekte Reise mit Echtzeit-Verkehrsupdates und intelligenter Routenoptimierung',
      'pt': 'Planeje sua viagem perfeita com atualizações de tráfego em tempo real e otimização inteligente de rotas',
      'it': 'Pianifica il tuo viaggio perfetto con aggiornamenti sul traffico in tempo reale e ottimizzazione intelligente del percorso'
    },
    'route.interactiveMaps': {
      'en': 'Interactive Maps',
      'es': 'Mapas Interactivos',
      'fr': 'Cartes Interactives',
      'de': 'Interaktive Karten',
      'pt': 'Mapas Interativos',
      'it': 'Mappe Interattive'
    },
    'route.realTimeTraffic': {
      'en': 'Real-time Traffic',
      'es': 'Tráfico en Tiempo Real',
      'fr': 'Trafic en Temps Réel',
      'de': 'Echtzeit-Verkehr',
      'pt': 'Tráfego em Tempo Real',
      'it': 'Traffico in Tempo Reale'
    },
    'route.optimization': {
      'en': 'Route Optimization',
      'es': 'Optimización de Rutas',
      'fr': 'Optimisation d\'Itinéraire',
      'de': 'Routenoptimierung',
      'pt': 'Otimização de Rotas',
      'it': 'Ottimizzazione del Percorso'
    },
    'route.waypoints': {
      'en': 'Multiple Waypoints',
      'es': 'Múltiples Puntos de Ruta',
      'fr': 'Points de Passage Multiples',
      'de': 'Mehrere Wegpunkte',
      'pt': 'Múltiplos Pontos de Passagem',
      'it': 'Punti di Passaggio Multipli'
    },
    'route.smartSearch': {
      'en': 'Smart Location Search',
      'es': 'Búsqueda Inteligente de Ubicación',
      'fr': 'Recherche Intelligente de Localisation',
      'de': 'Intelligente Standortsuche',
      'pt': 'Busca Inteligente de Localização',
      'it': 'Ricerca Intelligente della Posizione'
    },
    'route.smartSearchDesc': {
      'en': 'Find any destination with our intelligent search that suggests popular cities and locations across India.',
      'es': 'Encuentra cualquier destino con nuestra búsqueda inteligente que sugiere ciudades y ubicaciones populares en toda la India.',
      'fr': 'Trouvez n\'importe quelle destination avec notre recherche intelligente qui suggère des villes et des emplacements populaires à travers l\'Inde.',
      'de': 'Finden Sie jedes Ziel mit unserer intelligenten Suche, die beliebte Städte und Standorte in ganz Indien vorschlägt.',
      'pt': 'Encontre qualquer destino com nossa busca inteligente que sugere cidades e locais populares em toda a Índia.',
      'it': 'Trova qualsiasi destinazione con la nostra ricerca intelligente che suggerisce città e luoghi popolari in tutta l\'India.'
    },
    'route.realTimeUpdates': {
      'en': 'Real-time Updates',
      'es': 'Actualizaciones en Tiempo Real',
      'fr': 'Mises à Jour en Temps Réel',
      'de': 'Echtzeit-Updates',
      'pt': 'Atualizações em Tempo Real',
      'it': 'Aggiornamenti in Tempo Reale'
    },
    'route.realTimeDesc': {
      'en': 'Get live traffic conditions, estimated arrival times, and alternative route suggestions to avoid delays.',
      'es': 'Obtén condiciones de tráfico en vivo, tiempos estimados de llegada y sugerencias de rutas alternativas para evitar retrasos.',
      'fr': 'Obtenez les conditions de circulation en direct, les heures d\'arrivée estimées et des suggestions d\'itinéraires alternatifs pour éviter les retards.',
      'de': 'Erhalten Sie Live-Verkehrsbedingungen, geschätzte Ankunftszeiten und alternative Routenvorschläge, um Verzögerungen zu vermeiden.',
      'pt': 'Obtenha condições de tráfego ao vivo, horários estimados de chegada e sugestões de rotas alternativas para evitar atrasos.',
      'it': 'Ottieni condizioni del traffico in tempo reale, orari di arrivo stimati e suggerimenti di percorsi alternativi per evitare ritardi.'
    },
    'route.optimizationTitle': {
      'en': 'Route Optimization',
      'es': 'Optimización de Rutas',
      'fr': 'Optimisation d\'Itinéraire',
      'de': 'Routenoptimierung',
      'pt': 'Otimização de Rotas',
      'it': 'Ottimizzazione del Percorso'
    },
    'route.optimizationDesc': {
      'en': 'Automatically optimize your route with multiple waypoints for the fastest or shortest journey based on your preferences.',
      'es': 'Optimiza automáticamente tu ruta con múltiples puntos de ruta para el viaje más rápido o más corto según tus preferencias.',
      'fr': 'Optimisez automatiquement votre itinéraire avec plusieurs points de passage pour le trajet le plus rapide ou le plus court selon vos préférences.',
      'de': 'Optimieren Sie Ihre Route automatisch mit mehreren Wegpunkten für die schnellste oder kürzeste Reise basierend auf Ihren Präferenzen.',
      'pt': 'Otimize automaticamente sua rota com múltiplos pontos de passagem para a viagem mais rápida ou mais curta com base em suas preferências.',
      'it': 'Ottimizza automaticamente il tuo percorso con più punti di passaggio per il viaggio più veloce o più breve in base alle tue preferenze.'
    },
    'route.saveShare': {
      'en': 'Save & Share Routes',
      'es': 'Guardar y Compartir Rutas',
      'fr': 'Enregistrer et Partager les Itinéraires',
      'de': 'Routen Speichern und Teilen',
      'pt': 'Salvar e Compartilhar Rotas',
      'it': 'Salva e Condividi Percorsi'
    },
    'route.saveShareDesc': {
      'en': 'Save your favorite routes and share them with friends and family for easy trip planning.',
      'es': 'Guarda tus rutas favoritas y compártelas con amigos y familiares para una planificación de viaje fácil.',
      'fr': 'Enregistrez vos itinéraires préférés et partagez-les avec vos amis et votre famille pour une planification de voyage facile.',
      'de': 'Speichern Sie Ihre Lieblingsrouten und teilen Sie sie mit Freunden und Familie für eine einfache Reiseplanung.',
      'pt': 'Salve suas rotas favoritas e compartilhe-as com amigos e familiares para um planejamento de viagem fácil.',
      'it': 'Salva i tuoi percorsi preferiti e condividili con amici e familiari per una facile pianificazione del viaggio.'
    },
    'route.startPlanning': {
      'en': 'Start Planning Your Route',
      'es': 'Comienza a Planificar tu Ruta',
      'fr': 'Commencez à Planifier Votre Itinéraire',
      'de': 'Beginnen Sie mit der Planung Ihrer Route',
      'pt': 'Comece a Planejar sua Rota',
      'it': 'Inizia a Pianificare il Tuo Percorso'
    },
    'route.mapView': {
      'en': 'Interactive Map View',
      'es': 'Vista de Mapa Interactivo',
      'fr': 'Vue de Carte Interactive',
      'de': 'Interaktive Kartenansicht',
      'pt': 'Vista de Mapa Interativo',
      'it': 'Vista Mappa Interattiva'
    },

    // FAQ Section
    'faq.title': {
      'en': 'FREQUENTLY ASKED QUESTIONS',
      'es': 'PREGUNTAS FRECUENTES',
      'fr': 'QUESTIONS FRÉQUEMMENT POSÉES',
      'de': 'HÄUFIG GESTELLTE FRAGEN',
      'pt': 'PERGUNTAS FREQUENTES',
      'it': 'DOMANDE FREQUENTI'
    },
    'faq.general': {
      'en': 'General',
      'es': 'General',
      'fr': 'Général',
      'de': 'Allgemein',
      'pt': 'Geral',
      'it': 'Generale'
    },
    'faq.ticketRelated': {
      'en': 'Ticket-related',
      'es': 'Relacionado con Boletos',
      'fr': 'Lié aux Billets',
      'de': 'Ticketbezogen',
      'pt': 'Relacionado a Passagens',
      'it': 'Relativo ai Biglietti'
    },
    'faq.payment': {
      'en': 'Payment',
      'es': 'Pago',
      'fr': 'Paiement',
      'de': 'Zahlung',
      'pt': 'Pagamento',
      'it': 'Pagamento'
    },
    'faq.cancellation': {
      'en': 'Cancellation & Refund',
      'es': 'Cancelación y Reembolso',
      'fr': 'Annulation et Remboursement',
      'de': 'Stornierung und Rückerstattung',
      'pt': 'Cancelamento e Reembolso',
      'it': 'Cancellazione e Rimborso'
    },
    'faq.insurance': {
      'en': 'Insurance',
      'es': 'Seguro',
      'fr': 'Assurance',
      'de': 'Versicherung',
      'pt': 'Seguro',
      'it': 'Assicurazione'
    },
    'faq.more': {
      'en': 'More',
      'es': 'Más',
      'fr': 'Plus',
      'de': 'Mehr',
      'pt': 'Mais',
      'it': 'Altro'
    },
    'faq.trackBus': {
      'en': 'Can I track the location of my booked bus online?',
      'es': '¿Puedo rastrear la ubicación de mi autobús reservado en línea?',
      'fr': 'Puis-je suivre l\'emplacement de mon bus réservé en ligne?',
      'de': 'Kann ich den Standort meines gebuchten Busses online verfolgen?',
      'pt': 'Posso rastrear a localização do meu ônibus reservado online?',
      'it': 'Posso tracciare la posizione del mio autobus prenotato online?'
    },
    'faq.whyBook': {
      'en': 'Why book bus tickets online on tedbus?',
      'es': '¿Por qué reservar boletos de autobús en línea en tedbus?',
      'fr': 'Pourquoi réserver des billets de bus en ligne sur tedbus?',
      'de': 'Warum Bustickets online auf tedbus buchen?',
      'pt': 'Por que reservar passagens de ônibus online no tedbus?',
      'it': 'Perché prenotare biglietti dell\'autobus online su tedbus?'
    },
    'faq.createAccount': {
      'en': 'Do I need to create an account on the tedbus site to book my bus ticket?',
      'es': '¿Necesito crear una cuenta en el sitio de tedbus para reservar mi boleto de autobús?',
      'fr': 'Dois-je créer un compte sur le site tedbus pour réserver mon billet de bus?',
      'de': 'Muss ich ein Konto auf der tedbus-Website erstellen, um mein Busticket zu buchen?',
      'pt': 'Preciso criar uma conta no site tedbus para reservar minha passagem de ônibus?',
      'it': 'Devo creare un account sul sito tedbus per prenotare il mio biglietto dell\'autobus?'
    },
    'faq.costMore': {
      'en': 'Does bus booking online cost me more?',
      'es': '¿La reserva de autobús en línea me cuesta más?',
      'fr': 'La réservation de bus en ligne me coûte-t-elle plus cher?',
      'de': 'Kostet die Online-Busbuchung mehr?',
      'pt': 'A reserva de ônibus online me custa mais?',
      'it': 'La prenotazione dell\'autobus online mi costa di più?'
    },
    'faq.discounts': {
      'en': 'How can I get the discounts on the bus booking?',
      'es': '¿Cómo puedo obtener los descuentos en la reserva de autobús?',
      'fr': 'Comment puis-je obtenir les réductions sur la réservation de bus?',
      'de': 'Wie kann ich Rabatte bei der Busbuchung erhalten?',
      'pt': 'Como posso obter os descontos na reserva de ônibus?',
      'it': 'Come posso ottenere gli sconti sulla prenotazione dell\'autobus?'
    },
    'faq.whatsNew': {
      'en': 'What\'s New in Bus Booking on tedbus?',
      'es': '¿Qué hay de nuevo en la reserva de autobuses en tedbus?',
      'fr': 'Quoi de neuf dans la réservation de bus sur tedbus?',
      'de': 'Was ist neu bei der Busbuchung auf tedbus?',
      'pt': 'O que há de novo na reserva de ônibus no tedbus?',
      'it': 'Cosa c\'è di nuovo nella prenotazione dell\'autobus su tedbus?'
    },
    'faq.trackAnswer': {
      'en': 'Yes, you can track your bus online by using our bus tracking app feature called Track My Bus. This feature allows passengers and their families to track the live bus tracking location.',
      'es': 'Sí, puedes rastrear tu autobús en línea usando nuestra función de aplicación de rastreo de autobuses llamada Rastrear Mi Autobús. Esta función permite a los pasajeros y sus familias rastrear la ubicación en vivo del autobús.',
      'fr': 'Oui, vous pouvez suivre votre bus en ligne en utilisant notre fonction d\'application de suivi de bus appelée Suivre Mon Bus. Cette fonction permet aux passagers et à leurs familles de suivre l\'emplacement en direct du bus.',
      'de': 'Ja, Sie können Ihren Bus online verfolgen, indem Sie unsere Bus-Tracking-App-Funktion namens Meinen Bus Verfolgen verwenden. Diese Funktion ermöglicht es Passagieren und ihren Familien, den Live-Standort des Busses zu verfolgen.',
      'pt': 'Sim, você pode rastrear seu ônibus online usando nosso recurso de aplicativo de rastreamento de ônibus chamado Rastrear Meu Ônibus. Este recurso permite que passageiros e suas famílias rastreiem a localização ao vivo do ônibus.',
      'it': 'Sì, puoi tracciare il tuo autobus online utilizzando la nostra funzione di app di tracciamento dell\'autobus chiamata Traccia Il Mio Autobus. Questa funzione consente ai passeggeri e alle loro famiglie di tracciare la posizione in tempo reale dell\'autobus.'
    }
  };

  constructor(private languageService: LanguageService, private appRef: ApplicationRef) {
    // Initialize with current language
    const currentLanguage = this.languageService.getCurrentLanguage();
    this.updateTranslations(currentLanguage);
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(language => {
      this.updateTranslations(language);
      // Trigger change detection
      this.appRef.tick();
    });
  }

  private updateTranslations(language: string): void {
    this.currentTranslations = {};
    Object.keys(this.translations).forEach(key => {
      this.currentTranslations[key] = this.translations[key][language] || this.translations[key]['en'] || key;
    });
    this.translationsSubject.next(this.currentTranslations);
    console.log('Translations updated for language:', language);
  }

  translate(key: string): string {
    const currentLanguage = this.languageService.getCurrentLanguage();
    const translation = this.translations[key]?.[currentLanguage] || this.translations[key]?.['en'] || key;
    console.log(`Translating '${key}' to '${currentLanguage}':`, translation);
    return translation;
  }

  instant(key: string): string {
    return this.translate(key);
  }
}