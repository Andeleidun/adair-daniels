export interface XkcdComicContract {
  readonly kind: 'comic';
  readonly num: number;
  readonly title: string;
  readonly img: string;
  readonly alt: string;
}

export interface XkcdUnavailableContract {
  readonly kind: 'unavailable';
  readonly num: number;
}

export type XkcdSlotContract = XkcdComicContract | XkcdUnavailableContract;

export interface XkcdInitialContract {
  readonly latest: number;
  readonly slots: ReadonlyArray<XkcdSlotContract>;
}

export interface XkcdBatchContract {
  readonly start: number;
  readonly slots: ReadonlyArray<XkcdSlotContract>;
}

export interface StockTwitsMessageContract {
  readonly id: number;
  readonly body: string;
  readonly user: {
    readonly name: string;
    readonly username: string;
    readonly avatarUrl: string;
  };
}

export interface StockTwitsFeedContract {
  readonly symbol: string;
  readonly messages: ReadonlyArray<StockTwitsMessageContract>;
}

export interface RemoteErrorContract {
  readonly error: string;
}
