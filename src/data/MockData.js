export const farmers = [
  { id: 1, name: "Dinah V. Caburatan", coordinates: "8.4542° N, 124.6319° E", area: 2.4, status: "notified", lastAlert: "Jun 2, 2026", appStatus: "Active" },
  { id: 2, name: "Jhonara Fay F. Payot", coordinates: "8.4601° N, 124.6287° E", area: 1.8, status: "notified", lastAlert: "Jun 1, 2026", appStatus: "Active" },
  { id: 3, name: "Florie Jayne A. Soler", coordinates: "8.4478° N, 124.6355° E", area: 3.1, status: "resolved", lastAlert: "May 29, 2026", appStatus: "Inactive" },
  { id: 4, name: "Stella Marie B. Galinada", coordinates: "8.4523° N, 124.6401° E", area: 2.7, status: "no_alert", lastAlert: "May 25, 2026", appStatus: "Active" },
];

export const detections = [
  { id: 1, gps: "8.4542° N, 124.6319° E", datetime: "Jun 3, 2026 07:42 AM", class: "Black Sigatoka", confidence: 91, farmerId: 1 },
  { id: 2, gps: "8.4601° N, 124.6287° E", datetime: "Jun 3, 2026 08:15 AM", class: "Healthy", confidence: 97, farmerId: 2 },
  { id: 3, gps: "8.4478° N, 124.6355° E", datetime: "Jun 2, 2026 06:30 AM", class: "Black Sigatoka", confidence: 85, farmerId: 3 },
  { id: 4, gps: "8.4523° N, 124.6401° E", datetime: "Jun 2, 2026 09:00 AM", class: "Healthy", confidence: 99, farmerId: 4 },
];

export const notifications = [
  { id: 1, datetime: "Jun 3, 2026 07:45 AM", type: "UAV Alert", farmer: "Dinah V. Caburatan", coords: "8.4542° N, 124.6319° E", message: "Black Sigatoka detected at 91% confidence in your farm zone.", status: "Sent" },
  { id: 2, datetime: "Jun 1, 2026 08:20 AM", type: "UAV Alert", farmer: "Jhonara Fay F. Payot", coords: "8.4601° N, 124.6287° E", message: "Black Sigatoka detected at 85% confidence. Immediate action advised.", status: "Read" },
  { id: 3, datetime: "May 29, 2026 10:00 AM", type: "Resolved", farmer: "Florie Jayne A. Soler", coords: "8.4478° N, 124.6355° E", message: "Detection resolved. Follow-up UAV scan confirmed healthy status.", status: "Resolved" },
];

export const farmInfo = {
  name: "Talakag Banana Farm",
  location: "Talakag, Bukidnon, Philippines",
  totalArea: "10.0 ha",
  crop: "Cavendish Banana",
};