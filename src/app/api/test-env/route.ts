import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    keys: Object.keys(process.env),
    RDSHOST_exists: !!process.env.RDSHOST,
    RDSHOST_value: process.env.RDSHOST ? `${process.env.RDSHOST.substring(0, 10)}...` : null,
    USE_RDS_exists: !!process.env.USE_RDS,
    USE_RDS_value: process.env.USE_RDS,
  })
}
