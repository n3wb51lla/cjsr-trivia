import * as React from "react";

/**
 * Dismissible announcement bar for the top of the page. Deliberately styled as
 * an evergreen positioning statement, not a limited-time promo.
 */
export interface AnnouncementBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the dismiss button. @default true */
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export function AnnouncementBar(props: AnnouncementBarProps): JSX.Element;
