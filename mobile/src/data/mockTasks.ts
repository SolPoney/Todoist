import { Task } from '../components/TaskItem';

export const inboxTasks: Task[] = [
  { id: '1', title: 'Les fondements historiques de l\'action publique' },
  { id: '2', title: 'Prix quai des orfèvres', date: '3 avr. 2024', isRecurring: true, isOverdue: true },
  { id: '3', title: 'Livre "Pourquoi la police parisienne est malade"', date: '3 avr. 2024', isRecurring: true, isOverdue: true },
  { id: '4', title: 'Ventes = Attention + Persuasion', date: '3 avr. 2024', isRecurring: true, isOverdue: true },
  { id: '5', title: 'Que recherchent 25 millions de personnes pour 100€ ?', date: '3 avr. 2024', isRecurring: true, isOverdue: true },
  { id: '6', title: 'Annual report', date: '8 sept. 2025', isRecurring: true, isOverdue: true },
  { id: '7', title: 'Assurance e réputation', date: '3 avr. 2024', isOverdue: true },
  { id: '8', title: 'Cession PME', date: '3 avr. 2024', isOverdue: true },
  { id: '9', title: 'adie.org/Fiches-pratiques', date: '3 avr. 2024', isOverdue: true },
];

export const todayTasks: Task[] = [
  { id: '10', title: 'Prix quai des orfèvres', date: '3 avr. 2024', project: 'Boîte de réception', isRecurring: true, isOverdue: true },
  { id: '11', title: 'Livre "Pourquoi la police parisienne est malade"', date: '3 avr. 2024', project: 'Boîte de réception', isRecurring: true, isOverdue: true },
  { id: '12', title: 'Ventes = Attention + Persuasion', date: '3 avr. 2024', project: 'Boîte de réception', isRecurring: true, isOverdue: true },
  { id: '13', title: 'Que recherchent 25 millions de personnes pour 100€ ?', date: '3 avr. 2024', project: 'Boîte de réception', isRecurring: true, isOverdue: true },
  { id: '14', title: 'Assurance e réputation', date: '3 avr. 2024', project: 'Boîte de réception', isOverdue: true },
  { id: '15', title: 'Cession PME', date: '3 avr. 2024', project: 'Boîte de réception', isOverdue: true },
  { id: '16', title: 'adie.org/Fiches-pratiques', date: '3 avr. 2024', project: 'Boîte de réception', isOverdue: true },
  { id: '17', title: 'Médecine complémentaire pour la vue', date: '3 avr. 2024', project: 'Boîte de réception', isOverdue: true },
  { id: '18', title: 'Gestion de projet politique', date: '3 avr. 2024', project: 'Boîte de réception', isOverdue: true },
];
