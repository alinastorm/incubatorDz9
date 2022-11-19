(async () => {
    await import('./_common/services/mongoDb-service/mongoDbClient');
    await import("./_common/services/email-service/gmail-adapter");
    await import("./_common/services/periodicTasks-service");
    await import('./_common/services/http-service/http-service');

})()


