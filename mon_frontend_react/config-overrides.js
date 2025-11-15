module.exports = function override(config, env) {
  if (config.module?.rules) {
    config.module.rules.forEach(rule => {
      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(loader => {
          // Vérifie si c'est un loader source-map
          const uses = loader.use || [];
          uses.forEach(u => {
            if (u.loader?.includes('source-map-loader')) {
              // Exclut le module problématique
              u.exclude = /@yudiel\/react-qr-scanner/;
            }
          });
        });
      }
    });
  }

  return config;
};
