class MyCustomReporter {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.startTime = null;
  }

  onBegin(config, suite) {
    this.startTime = Date.now();
    console.log('\n========================================');
    console.log('   TEST RUN STARTED');
    console.log('========================================');
    console.log(`Total tests to run: ${suite.allTests().length}`);
    console.log(`Browsers: ${config.projects.map(p => p.name).join(', ')}`);
    console.log('========================================\n');
  }

  onTestBegin(test) {
    console.log(`▶ RUNNING: ${test.title}`);
  }

  onTestEnd(test, result) {
    if (result.status === 'passed') {
      this.passed++;
      console.log(`  ✅ PASSED: ${test.title} (${result.duration}ms)`);
    } else if (result.status === 'failed') {
      this.failed++;
      console.log(`  ❌ FAILED: ${test.title} (${result.duration}ms)`);
      console.log(`     Error: ${result.error?.message?.split('\n')[0]}`);
    } else if (result.status === 'skipped') {
      this.skipped++;
      console.log(`  ⏭ SKIPPED: ${test.title}`);
    }
  }

  onEnd(result) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log('   TEST RUN COMPLETED');
    console.log('========================================');
    console.log(`✅ Passed:  ${this.passed}`);
    console.log(`❌ Failed:  ${this.failed}`);
    console.log(`⏭ Skipped: ${this.skipped}`);
    console.log(`⏱ Duration: ${duration}s`);
    console.log(`📊 Status: ${result.status.toUpperCase()}`);
    console.log('========================================\n');
  }
}

export default MyCustomReporter;