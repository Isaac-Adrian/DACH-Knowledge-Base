# DACH Data Flow Architecture

DACH (Data Architecture Hub) is a data platform that enables producers to publish data products and consumers to subscribe to them.

## High-Level Data Flow

```
Producer App 
    ↓ (DACH Producer Client)
DPI Event Hub ({domain}-{product}-dpi)
    ↓ (CPW Worker)
Canonical Event Hub ({domain}-{product})
    ↓ (CCW Worker)      ↓ (CSW Worker)
Business Objects    Current State
    ↓                   ↓
Cosmos DB ({domain}-{product} container)
    ↓ (Cosmos change feed)
Consumer Adapter (COS/Event Hub)
    ↓ (Liquid transform)
Target Proxy (Consumer's system)
```

This architecture enables decoupled, event-driven data sharing with transformation capabilities at both producer and consumer boundaries, while maintaining a canonical data model in the center.

## 1. Data Production (Inbound)

**Flow:** Producers → Data Port Inbound (DPI) → Event Hub

- **Producer Applications** use the DACH Producer Client library to send data to DACH
- Data is sent to a **Data Port Inbound Event Hub** (format: `{dataDomain}-{dataProduct}-dpi`)
- Producers can be Function Apps, Azure Data Factory, or other applications
- Messages are wrapped in **DACHMessage** format with metadata (id, partition key, correlation id, content)
- Each data product has its own Event Hub instance within a shared Premium Event Hub Namespace

## 2. Data Processing (Workers)

Event Hub triggers DACH Workers (Azure Functions) that process data through multiple stages:

### CPW - Canonical Producer Worker
- Reads from Data Port Inbound Event Hub (`{dataDomain}-{dataProduct}-dpi`)
- Applies Liquid templates to transform raw data into canonical format
- Publishes transformed data to the canonical Event Hub (`{dataDomain}-{dataProduct}`)

### CCW - Canonical Creator Worker
- Reads from canonical Event Hub (`{dataDomain}-{dataProduct}`)
- Processes Business Events (partial objects)
- Applies schema validation
- Merges partial objects based on business rules to create complete Business Objects
- Stores data in Cosmos DB containers by data product

### CSW - Current State Worker
- Reads from canonical Event Hub
- Maintains the current state of Business Objects in Cosmos DB
- Stores both Business Objects and Business Events
- Provides the "golden record" for each entity

### CPW - Canonical Publish Worker (mentioned in glossary)
- Publishes canonical data to consumer-specific Event Hubs

## 3. Data Consumption (Outbound)

**Flow:** Cosmos DB → Consumer Adapters → Target Systems

- **Consumer Adapters** are deployed per consumer application
- Multiple adapter types available:
  - **COS (Cosmos Adapter)** - Reads from Cosmos change feed
  - **Event Hub Adapter** - Reads from consumer-specific Event Hubs
  - **OND (On Demand)** - Event Grid triggered for bulk data loads
- Adapters apply consumer-specific Liquid templates to transform canonical data to consumer format
- Data is sent to consumer target proxies (databases, message queues, APIs)

## 4. Storage & State Management

### Cosmos DB
- Central storage for all data products
- Each data product has dedicated containers (e.g., `{dataDomain}-{dataProduct}`)
- Stores both Business Objects and Business Events
- Partition key strategy for scalability

### Blob Storage
- Historical data capture via Event Hub Capture (Avro format)

### App Configuration
- Stores configuration, templates, and deployment state

## 5. Key Components

- **Event Hub Namespace:** Single premium namespace hosting all Event Hubs (can handle 1600+ Event Hubs)
- **DACH Producer Client:** .NET library for producing messages
- **Adapter Framework:** Shared .NET code for workers and adapters
- **Liquid Templates:** For data transformation at producer and consumer sides
- **Schema Validation:** Ensures data quality using JSON schemas