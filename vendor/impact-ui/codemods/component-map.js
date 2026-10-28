/**
 * Component mapping configuration for impact-ui migration
 * Maps component names to their sub-path imports for tree shaking
 */

const componentMap = {
  // Accordion
  Accordion: {
    path: 'impact-ui/Accordion',
    exports: ['Accordion', 'AccordionProps'],
  },

  // Alert
  Alert: {
    path: 'impact-ui/Alert',
    exports: ['Alert', 'AlertProps'],
  },

  // Avatar
  Avatar: {
    path: 'impact-ui/Avatar',
    exports: ['Avatar', 'AvatarProps'],
  },

  // Badge
  Badge: {
    path: 'impact-ui/Badge',
    exports: [
      'Badge',
      'BadgeProps',
      'FilledBadge',
      'FilledIconLabelBadges',
      'FilledOnlyIconBadges',
      'FilledOnlyLabelBadges',
      'StrokeBadge',
      'StrokeIconLabelBadges',
      'StrokeOnlyIconBadges',
      'StrokeOnlyLabelBadges',
      'SubtleBadge',
      'SubtleIconLabelBadges',
      'SubtleOnlyIconBadges',
      'SubtleOnlyLabelBadges',
    ],
  },

  // Button
  Button: {
    path: 'impact-ui/Button',
    exports: ['Button', 'ButtonProps'],
  },

  // Card
  Card: {
    path: 'impact-ui/Card',
    exports: ['Card', 'CardProps'],
  },

  // Checkbox
  Checkbox: {
    path: 'impact-ui/Checkbox',
    exports: [
      'Checkbox',
      'CheckboxProps',
      'DashedCheckbox',
      'DefaultCheckbox',
      'CheckboxWithDropDown',
      'CheckboxWithoutFormLabel',
    ],
  },

  // Chips
  Chips: {
    path: 'impact-ui/Chips',
    exports: ['Chips', 'ChipsProps', 'Chip'],
  },

  // Input
  Input: {
    path: 'impact-ui/Input',
    exports: ['Input', 'InputProps', 'InputWithIcon', 'VanillaInput', 'HelperText'],
  },

  // Switch
  Switch: {
    path: 'impact-ui/Switch',
    exports: ['Switch', 'SwitchProps'],
  },

  // Tag
  Tag: {
    path: 'impact-ui/Tag',
    exports: ['Tag', 'TagProps', 'FilledTag', 'StrokeTag', 'SolidTag'],
  },

  // Tooltip
  Tooltip: {
    path: 'impact-ui/Tooltip',
    exports: ['Tooltip', 'TooltipProps'],
  },

  // Utils - matches any import ending with Props or utils
  utils: {
    path: 'impact-ui/utils',
    exports: [],
  },

  // Types
  types: {
    path: 'impact-ui/types',
    exports: [],
  },
};

/**
 * Build a reverse lookup map: export name -> import path
 * This allows O(1) lookup of where to import any given export from
 */
function buildExportLookup() {
  const lookup = {};

  Object.entries(componentMap).forEach(([componentName, config]) => {
    // Add the component name itself as a valid import
    lookup[componentName] = config.path;

    // Add all named exports for this component
    config.exports.forEach((exportName) => {
      lookup[exportName] = config.path;
    });
  });

  return lookup;
}

/**
 * Get list of all valid component paths
 */
function getValidPaths() {
  return Object.values(componentMap).map((config) => config.path);
}

/**
 * Get all component names
 */
function getComponentNames() {
  return Object.keys(componentMap);
}

module.exports = {
  componentMap,
  buildExportLookup,
  getValidPaths,
  getComponentNames,
};
