declare module 'react-swipeable-views' {
  import * as React from 'react';

  export interface SwipeableViewsProps {
    readonly axis?: 'x' | 'x-reverse' | 'y' | 'y-reverse';
    readonly children?: React.ReactNode;
    readonly index?: number;
    readonly onChangeIndex?: (index: number, previousIndex: number) => void;
  }

  const SwipeableViews: React.ComponentType<SwipeableViewsProps>;
  export default SwipeableViews;
}

declare module 'react-swipeable-views-utils' {
  import * as React from 'react';
  import { SwipeableViewsProps } from 'react-swipeable-views';

  interface AutoPlaySwipeableViewsProps extends SwipeableViewsProps {
    readonly autoplay?: boolean;
    readonly interval?: number;
  }

  export function autoPlay(
    component: React.ComponentType<SwipeableViewsProps>
  ): React.ComponentType<AutoPlaySwipeableViewsProps>;
}
