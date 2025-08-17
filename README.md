# Product Manager (Remote App)

A microfrontend remote application for managing products with real-time state synchronization capabilities.

## Setup

### Prerequisites

- Node.js >= 22.14.0 (use `nvm use` if you have nvm installed)
- npm or yarn

### Environment

Create a `.env` file in the root directory with the following variables:

```bash
# Product Manager port
VITE_PORT=4001
```

**Environment Variables:**
- `VITE_PORT` - Port for the development server (default: 4001)

### Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   Open http://localhost:4001 (or your custom VITE_PORT)

## Architecture

### Dual Mode Operation
This application can operate in two modes:

#### Standalone Mode
- **Independent Operation**: Run as a complete product management application
- **Full UI**: Includes all product management features (create, view, toggle status)
- **Local State**: Manages its own state using React Context
- **Direct Usage**: Access directly via browser for development and testing

#### Microfrontend Mode
- **Remote Integration**: Consumed by host applications via Module Federation
- **Exposed Components**: Makes the main App component available to host apps
- **State Broadcasting**: Communicates state changes via custom DOM events

### State Propagation
The application uses **Custom DOM Events** to communicate state changes to host applications:

#### Communication Events
Events follow the pattern: `sx-product-manager:{event-name}`

**Dispatched Events:**
- `sx-product-manager:product-added` - When a new product is created
  ```javascript
  {
    detail: {
      product: Product
    }
  }
  ```

- `sx-product-manager:product-status-toggled` - When product status changes
  ```javascript
  {
    detail: {
      productId: string,
      oldStatus: 'active' | 'inactive',
      newStatus: 'active' | 'inactive'
    }
  }
  ```

#### Event Broadcasting
- **Automatic**: Events are dispatched automatically on state changes
- **Bubbling**: Events bubble up to the window level for cross-app communication
- **Real-time**: Immediate propagation ensures instant synchronization
- **Decoupled**: No direct dependencies on consuming applications

### Module Federation
Uses **Module Federation** from Vite to expose components as remotely consumable modules:

- **Exposed Module**: `./App` - Main application component
- **Shared Dependencies**: React and React-DOM are shared with host applications
- **Runtime Loading**: Components are loaded dynamically by host applications
- **Independent Deployment**: Can be built and deployed separately from host apps

### State Management
- **React Context**: Uses ProductsContext for centralized state management
- **Event-Driven Updates**: UI updates trigger custom event dispatch

### Application Structure
```
src/
├── components/
│   ├── ProductForm.tsx          # Product creation form
│   └── ProductTable.tsx         # Product listing and management
├── contexts/
│   └── ProductsContext.tsx      # State management context
├── types/
│   └── Product.ts               # Product type definitions
├── utils/
│   ├── getLocalStorageItem.ts   # localStorage utilities
│   └── setLocalStorageItem.ts
└── App.tsx                      # Main application component
```

### Key Features
- **Product Management**: Create products with title, SKU, price, and status
- **Status Toggle**: Switch products between active and inactive states
- **Real-time Events**: State changes are broadcast to consuming applications