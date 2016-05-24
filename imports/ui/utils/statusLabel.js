function statusLabel(user) {
  let status = "online";
  if (! user.status.online) {
    status = "offline";
  } else if (user.status.idle) {
    status = "idle";
  }
  return status;
}

export default statusLabel;
