export interface NavItem {
  href: string;
  label: string;
  description: string;
}

export interface DemoMetric {
  label: string;
  value: string;
  change: string;
}

export interface DemoSection {
  title: string;
  description: string;
}

export interface MarketItem {
  label: string;
  value: string;
  change: string;
}

export interface DemoWorkspaceItem {
  label: string;
  value: string;
  detail: string;
}

export interface DemoWorkspace {
  title: string;
  description: string;
  items: DemoWorkspaceItem[];
}
