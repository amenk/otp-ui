export type Location = {
  lat: number;
  lon: number;
  name: string;
  /**
   * This is only used for locations that a user has saved. Can be either:
   * "home" or "work"
   */
  type?: string;
};

export type FromToPickerProps = {
  /**
   * A specific location to associate with this. This is only used when combined
   * with the setLocation prop.
   */
  location?: Location;
  /**
   * Triggered when the user clicks on the "from" button.
   */
  onFromClick: () => void;
  /**
   * Triggered when the user clicks on the "to" button.
   */
  onToClick: () => void;
  /**
   * Triggered when the user clicks either the "from" or "to" button and there
   * are no from/to specific handler functions defined as props.
   *
   * Passes an argument as follows:
   * { locationType: "from/to", location, reverseGeocode: false }
   */
  setLocation?: ({
    locationType: string,
    location: Location,
    reverseGeocode: boolean
  }) => void;
  /**
   * Determines whether icons are shown on the "from" and "to" buttons.
   */
  showIcons?: boolean;
};
