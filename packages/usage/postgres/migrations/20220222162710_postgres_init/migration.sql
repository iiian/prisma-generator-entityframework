-- CreateTable
CREATE TABLE "AllFieldsTest" (
    "id" SERIAL NOT NULL,
    "ip_addr" INET NOT NULL,
    "guid" UUID NOT NULL,
    "an_xml" XML NOT NULL,
    "a_short" SMALLINT NOT NULL,
    "a_uint" OID NOT NULL,
    "bit_arr" BIT(2) NOT NULL,
    "json" JSON NOT NULL,
    "jsonb" JSONB NOT NULL,

    CONSTRAINT "AllFieldsTest_pkey" PRIMARY KEY ("id")
);
