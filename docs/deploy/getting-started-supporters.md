# 🚀 Getting Started for Supporters (Forge Plan & Above)

Welcome, and thank you for supporting **wacraft**\! This guide will walk you through the initial setup for the premium features unlocked with your plan, including building the necessary Docker images for **Campaigns** and **Node-RED automations**.

## 1\. Building the Docker Images

As a supporter, you have access to the private Git repositories for `wacraft-server` and `wacraft-node-red-defaults`. To use the premium features, you'll need to build the Docker images from these repositories.

### 1.1. `wacraft-server`

This image contains the core backend server with all features unlocked, including the **Campaigns** module.

```bash
# Clone the repository
git clone git@github.com:Astervia/wacraft-server.git
cd wacraft-server

# Build the Docker image
docker build --ssh default -t astervia/wacraft-server:latest -t astervia/wacraft-server:latest .
```

We recommend tagging the image with both `latest` and the specific version number (e.g., `v0.1.1`) to ensure your deployments are consistent and predictable.

### 1.2. `wacraft-nodered`

This image provides a pre-configured Node-RED environment with custom nodes for wacraft, allowing you to build powerful automations.

```bash
# Clone the repository
git clone git@github.com:Astervia/wacraft-node-red-defaults.git
cd wacraft-node-red-defaults

# Build the Docker image
docker build --ssh default -t astervia/wacraft-nodered:latest -t astervia/wacraft-nodered:v0.1.1 .
```

Just like with the server, we recommend tagging with both `latest` and the specific version number.

## 2\. What's Next?

Now that you have your custom Docker images, you can start exploring the premium features you've unlocked.

### 2.1. Explore Campaigns

The **Campaigns** feature allows you to send bulk messages to your users. To learn how to create and manage campaigns, please refer to our detailed **[Campaigns Guide](../guide/campaigns.md)**.

### 2.2. Dive into Node-RED Automations

With the `wacraft-nodered` image, you can create powerful automations to handle incoming messages, interact with external services, and much more. For a complete guide on setting up and using Node-RED with wacraft, please see our **[Node-RED Integration Guide](./node-red.md)**.
