appointments.forEach(app => {
  const prev = savedMap[app._id];
  const curr = app.status;

  if (prev && prev !== curr) {
    const date = new Date(app.date).toLocaleDateString();
    const notifId = `${app._id}-${curr}`;

    if (curr === "rejected") {
      // ✅ was pending → rejected
      addNotification(notifId,
        `❌ Dr. ${app.doctor?.name} has rejected your appointment request for ${date}. You may book another slot.`,
        "error"
      );
    } else if (curr === "cancelled" && prev === "accepted") {
      // ✅ was accepted → cancelled by doctor
      addNotification(notifId,
        `⚠️ Dr. ${app.doctor?.name} has cancelled your confirmed appointment on ${date}. Please book a new appointment.`,
        "warning"
      );
    } else if (curr === "cancelled" && prev === "pending") {
      // ✅ was pending → cancelled
      addNotification(notifId,
        `⚠️ Dr. ${app.doctor?.name} has cancelled your appointment request for ${date}.`,
        "warning"
      );
    } else if (curr === "accepted") {
      addNotification(notifId,
        `✅ Dr. ${app.doctor?.name} has confirmed your appointment on ${date}. Check the Accepted tab for details.`,
        "success"
      );
    } else if (curr === "completed") {
      addNotification(notifId,
        `🌟 Your appointment with Dr. ${app.doctor?.name} on ${date} is completed! Go to History tab to rate your experience.`,
        "success"
      );
    }
  }
});
