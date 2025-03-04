-- CreateTable
CREATE TABLE "MqttConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mqttUrl" TEXT NOT NULL DEFAULT 'ws://172.16.202.63:8083/mqtt',
    "location" TEXT NOT NULL DEFAULT 'สถานที่',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
