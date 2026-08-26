module.exports = {
  DOMParser: class { parseFromString() { return { documentElement: {} }; } },
  XMLSerializer: class { serializeToString() { return ''; } }
};
