# 🌾 GramAI Advisor

![Status](https://img.shields.io/badge/Status-Active-success)
![AI](https://img.shields.io/badge/AI-Multi--Agent-blue)
![Cloud](https://img.shields.io/badge/Cloud-Google%20Cloud-orange)
![MCP](https://img.shields.io/badge/MCP-Enabled-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌍 Overview

**GramAI Advisor** is a **multi-agent AI system** designed to help farmers make intelligent decisions about land usage, crop planning, financial strategy, and government schemes.

It transforms simple inputs like **land sketches and soil reports** into:

- 📊 Optimized land allocation
- 🌱 Crop recommendations
- 💰 Income projections
- 🏛 Government scheme insights
- 🛠 Actionable farming tasks (MCP tools)

---

## 🧠 Key Features

✅ Multi-agent AI orchestration  
✅ MCP (Model Context Protocol) tool integration  
✅ Land sketch → smart zoning visualization  
✅ Revenue-based crop planning  
✅ Multilingual-ready architecture  
✅ Demo-safe fallback system  
✅ Interactive farming insights  

---

## 🏗 Architecture

User Input (Farmer Details + Land Sketch)
↓
🧠 Orchestrator Agent
↓
┌───────────────┬───────────────┬───────────────┐
│ Crop Agent │ Land Agent │ Finance Agent │
└───────────────┴───────────────┴───────────────┘
↓
🏛 Scheme Agent
↓
🛠 MCP Tool Layer
(Tasks | Calendar | Notes)
↓
Final Farming Plan


---

## 🔌 MCP Tool Integration

GramAI implements **MCP-style tool orchestration**:

| Tool | Function |
|------|--------|
| 🗂 Task Manager | Creates farming tasks (sowing, irrigation) |
| 📅 Calendar | Schedules crop lifecycle events |
| 📝 Notes | Stores AI-generated farming plans |

Example:

```json
{
  "tool": "task_manager",
  "action": "create_task",
  "task": "Sow paddy",
  "date": "June 15"
}

🧪 Sample Inputs
🗺️ Land Sketch

🧪 Soil Report

🚀 Demo Flow
Enter farmer details
Upload land sketch
Select crop preferences
Click Generate AI Farming Plan
Output Includes:
🌾 Land zoning map
📊 Revenue timeline
💰 Financial analysis
🏛 Government schemes
🛠 MCP tool actions
🖥️ Tech Stack
Google AI Studio (Gemini)
Google Cloud (Cloud Run, Firestore)
JavaScript / React (UI)
AI Prompt Engineering
MCP Simulation Layer
⚠️ Note on Architecture

Due to API quota constraints in AI Studio:

A single orchestrator call is used for demo reliability
The system is designed to scale into a true multi-agent architecture on Google Cloud
🏆 Innovation Highlights
Combines agriculture + finance + policy intelligence
Converts land sketches into AI zoning maps
Enables income-driven farming decisions
Bridges gap between farmers and formal finance
👨‍💻 Author

A Samuel Arun Kumar
Banker | AI Enthusiast | Rural Innovation Builder

📌 Future Enhancements
Real-time market price integration
IoT-based soil analysis
Full Vertex AI deployment
Mobile app for farmers
