-- CreateTable
CREATE TABLE "MqttConfig" (
    "id" TEXT NOT NULL,
    "mqttUrl" TEXT NOT NULL DEFAULT 'ws://172.16.202.63:8083/mqtt',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MqttConfig_pkey" PRIMARY KEY ("id")
);
