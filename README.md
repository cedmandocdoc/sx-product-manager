# Product Manager (Remote App)

A microfrontend remote application built with React, Vite, and TypeScript that provides product management functionality.

## Features

- **Product Form**: Create new products with title, SKU, price, and status
- **Product Table**: Display all products with real-time updates
- **Status Toggle**: Switch products between active and inactive states
- **State Management**: Centralized store with subscription-based updates
- **Module Federation**: Exposes components and store for consumption by host apps

## Architecture

### Microfrontend Configuration
- **Remote Name**: `productManager`
- **Port**: 4001
- **Exposed Modules**:
  - `./ProductModule`: Main product management component
  - `./ProductProvider`: React Context provider for state management

### State Management
The app uses React Context for state management with:
- **ProductContext**: Centralized state management using React Context and useReducer
- **Custom Events**: Real-time updates via custom DOM events
- **Event Communication**: Cross-app communication through window events

### Technical Decisions

1. **React Context vs Redux**: Chose React Context with useReducer for lightweight state management while maintaining React patterns.

2. **Custom Events Communication**: Used DOM custom events for cross-app communication, following the pattern `{repo-name}:{event-name}` for clear event namespacing.

3. **Module Federation**: Exposes both the UI component and the context provider separately to give the host app flexibility in integration.

4. **TypeScript**: Provides type safety and better developer experience.

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Navigate to the product manager directory:
   ```bash
   cd sx-product-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:4001 to view the standalone app

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Standalone Mode
Run the app independently to test product management functionality.

### Microfrontend Mode
The app automatically exposes its modules when running. The host app can consume:
- `productManager/ProductModule` - The main UI component (includes ProductProvider)
- `productManager/ProductProvider` - The React Context provider

### Communication Events

#### Dispatched Events (Product Manager → Dashboard)
- `sx-product-manager:product-added` - When a new product is created
- `sx-product-manager:product-updated` - When a product is modified
- `sx-product-manager:product-removed` - When a product is deleted
- `sx-product-manager:product-status-toggled` - When product status changes
- `sx-product-manager:metrics-response` - Response to metrics request

#### Listened Events (Dashboard → Product Manager)
- `sx-dashboard:request-metrics` - Request for current metrics data

#### Event Data Structure
All events include a `detail.metrics` object with:
```typescript
{
  total: number;    // Total number of products
  active: number;   // Number of active products
  inactive: number; // Number of inactive products
}
```

#### Product Interface
```typescript
interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}
```

## Development

### File Structure
```
src/
├── components/          # React components
│   ├── ProductForm.tsx  # Product creation form
│   └── ProductTable.tsx # Product listing table
├── hooks/              # Custom React hooks
│   └── useProductStore.ts
├── store/              # State management
│   └── productStore.ts
├── types/              # TypeScript definitions
│   └── Product.ts
├── ProductModule.tsx   # Main exported component
├── App.tsx            # Standalone app wrapper
└── main.tsx           # Entry point
```

### Adding New Features
1. Update the Product interface in `types/Product.ts`
2. Modify the ProductStore methods as needed
3. Update components to handle new fields
4. Export any new functionality via Module Federation

## Troubleshooting

### Port Conflicts
If port 4001 is busy, update the port in `vite.config.ts`:
```typescript
server: {
  port: YOUR_PORT
}
```

### Module Federation Issues
- Ensure the app is running before the host app tries to consume it
- Check the network tab for failed remote module requests
- Verify the remote URL in the host app configuration
