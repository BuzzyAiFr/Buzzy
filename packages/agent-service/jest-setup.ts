// This file is executed by Jest before running any tests.
// It's the perfect place to import global dependencies required for the test environment.

// NestJS uses decorators and metadata extensively. The 'reflect-metadata'
// library is required for the metadata reflection API to work correctly.
// Without this import, decorator metadata might not be available at runtime,
// causing issues with dependency injection and features like the DiscoveryService.
import 'reflect-metadata';
