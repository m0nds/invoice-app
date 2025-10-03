# Icons System

This project includes a comprehensive icon system that allows you to easily import and use SVG icons as React components throughout your application.

## Available Icons

The following icons are available in `src/assets/icons/icons.jsx`:

- **InvoiceIcon** - Invoice/document icon
- **InvoiceBigIcon** - Large invoice icon
- **MoneyIcon** - Money/financial icon
- **MoneyIconAlt** - Alternative money icon
- **CustomerIcon** - Customer/user icon
- **SettingsIcon** - Settings/gear icon
- **OverviewIcon** - Overview/dashboard icon
- **GettingStartedIcon** - Getting started icon
- **HelpCenterIcon** - Help center icon
- **BeneficiaryIcon** - Beneficiary icon
- **NotificationIcon** - Notification/bell icon

## Usage

### Import Individual Icons

```jsx
import { Invoice, Money, Customer } from '../assets/icons/icons.jsx';

function MyComponent() {
  return (
    <div>
      <Invoice width={24} height={24} />
      <Money width={32} height={32} className="text-blue-500" />
      <Customer width={20} height={20} />
    </div>
  );
}
```

### Import All Icons

```jsx
import Icons from '../assets/icons/icons.jsx';

function MyComponent() {
  return (
    <div>
      <Icons.InvoiceIcon width={24} height={24} />
      <Icons.MoneyIcon width={24} height={24} />
    </div>
  );
}
```

### Import Named Exports

```jsx
import { 
  InvoiceIcon, 
  MoneyIcon, 
  CustomerIcon 
} from '../assets/icons/icons.jsx';

function MyComponent() {
  return (
    <div>
      <InvoiceIcon width={24} height={24} />
      <MoneyIcon width={24} height={24} />
      <CustomerIcon width={24} height={24} />
    </div>
  );
}
```

## Props

All icon components accept standard SVG props:

- `width` - Width of the icon
- `height` - Height of the icon
- `className` - CSS classes to apply
- `style` - Inline styles
- `fill` - Fill color
- `stroke` - Stroke color
- `strokeWidth` - Stroke width
- And any other SVG element props

## Examples

### Basic Usage

```jsx
<Invoice width={24} height={24} />
```

### With Custom Styling

```jsx
<Money 
  width={32} 
  height={32} 
  className="text-blue-500 hover:text-blue-700" 
/>
```

### With Custom Colors

```jsx
<Settings 
  width={20} 
  height={20} 
  fill="currentColor" 
  stroke="#374151" 
/>
```

## Technical Details

- Icons are processed using `vite-plugin-svgr`
- All SVGs are converted to React components
- TypeScript support is included
- Icons maintain their original SVG structure
- Optimized for performance and tree-shaking

## Adding New Icons

To add new icons:

1. Place your SVG file in `src/assets/icons/`
2. Import it in `src/assets/icons/icons.js`
3. Export it with a descriptive name
4. Use it in your components

Example:

```jsx
// In icons.jsx
import NewIcon from './newIcon.svg?react';
export { NewIcon };
export const New = (props) => <NewIcon {...props} />;

// In your component
import { New } from '../assets/icons/icons.jsx';
<New width={24} height={24} />
```
