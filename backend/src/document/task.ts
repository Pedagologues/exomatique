import { CronJob } from "cron";
import { cleanup } from "./internal";

class CleaningTask {
  cronJob: CronJob;

  constructor() {
    console.log("Setup document cleaning task . . .");
    this.cronJob = new CronJob("0 0 0 */1 * *", async () => {
      cleanup();
    });

    // Start job
    if (!this.cronJob.running) {
      this.cronJob.start();
    }
  }
}

new CleaningTask();
