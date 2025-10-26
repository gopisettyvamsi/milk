module.exports = {
  apps: [
    {
      name: "ENS-APP",
      script: "npm",
      args: "start",
      watch: false,
      instances: "max",  // or a number like 4
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "1G"
    }
  ]
}