import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    RDSHOST: process.env.RDSHOST || '',
    USE_RDS: process.env.USE_RDS || '',
    DB_NAME: process.env.DB_NAME || '',
    DB_USER: process.env.DB_USER || '',
  }
};

export default nextConfig;
