function run(): void {
  try {
    console.info('Cron has started successfully!');
  } catch (error) {
    console.error(
      error,
      'Error in cron startup!',
    );
  }
}

run();
