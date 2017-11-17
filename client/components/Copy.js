// @flow

import React, { PureComponent } from 'react';

type CopyProps = { copyHTML: string };

/**
 * This is a wrapper around the HTML copy. It uses PureComponent to stop it re-rendering
 * unnecessarily.
 */

export default class Copy extends PureComponent<CopyProps> {
  props: CopyProps;

  render() {
    const { copyHTML } = this.props;

    // eslint-disable-next-line react/no-danger
    return <div className="copy" dangerouslySetInnerHTML={{ __html: copyHTML }} />;
  }
}
