export interface UserData {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
  avatar: string;
  isStaff: boolean;
  isAdmin: boolean;
  created: string;
  updated: string;
  isActive: boolean;
  departments: [DepartmentData];
  committees: [CommitteeData];
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface DepartmentData {
  id: number;
  name: string;
  description: string;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface UserDepartmentData {
  id: number;
  user: UserData;
  department: DepartmentData;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface VenueData {
  id: number;
  name: string;
  description: string;
  venueType: string;
  capacity: number;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  eventType: string;
  eventTypeValue: string;
  startTime: string;
  endTime: string;
  quarter: string;
  financialYear: string;
  created: string;
  updated: string;
  isActive: boolean;
  author: UserData;
  venue: VenueData;
  attendees: [UserData];
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
  manageDocuments: boolean;
  manageAgendas: boolean;
  manageMinutes: boolean;
}

export interface EventDepartmentData {
  id: number;
  event: EventData;
  department: DepartmentData;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventAttendeeData {
  id: number;
  event: EventData;
  attendee: UserData;
  isAttending: boolean;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventAgendaData {
  id: number;
  event: EventData;
  title: string;
  description: string;
  index: number;
  startTime: string;
  endTime: string;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventDocumentData {
  id: number;
  event: EventData;
  title: string;
  description: string;
  file: string;
  author: UserData;
  note: EventUserDocumentNoteData;
  departments: [DepartmentData];
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface CommitteeData {
  id: number;
  name: string;
  description: string;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface UserCommitteeData {
  id: number;
  user: UserData;
  committee: CommitteeData;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventComitteeData {
  id: number;
  event: EventData;
  committee: CommitteeData;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface CommitteeDepartmentData {
  id: number;
  department: DepartmentData;
  committee: CommitteeData;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventUserDocumentNoteData {
  id: number;
  eventDcoument: EventDocumentData;
  user: UserData;
  note: string;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface EventMinuteData {
  id: number;
  content: string;
  event: EventData;
  author: UserData;
  index: number;
  created: string;
  updated: string;
  isActive: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManage: boolean;
}
