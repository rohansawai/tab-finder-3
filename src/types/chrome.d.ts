// Chrome extension types
declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      openerTabId?: number;
      selected: boolean;
      active: boolean;
      highlighted: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }

    function query(queryInfo: object): Promise<Tab[]>;
    function update(tabId: number, updateProperties: object): Promise<Tab>;
    function get(tabId: number): Promise<Tab>;
  }

  namespace windows {
    function update(windowId: number, updateProperties: object): Promise<void>;
  }

  namespace runtime {
    const onInstalled: {
      addListener(callback: (details: { reason: string; id?: string; previousVersion?: string }) => void): void;
    };
  }
} 