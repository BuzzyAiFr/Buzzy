import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentProfile } from './agent-profile.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * A repository for managing Agent Profiles.
 * This is a simple in-memory implementation for now.
 */
@Injectable()
export class AgentProfileRepository {
  private readonly profiles = new Map<string, AgentProfile>();

  constructor() {
    // Pre-populate with a default agent profile for ease of use.
    this.create({
      name: 'General Purpose Agent',
      role: 'You are a helpful and general-purpose AI assistant. Your goal is to assist the user with their tasks by planning and executing actions accurately.',
      goals: ['Assist users with their objectives.', 'Provide accurate results.'],
    });
  }

  /**
   * Creates a new agent profile.
   * @param profileData The data for the new profile.
   * @returns The newly created agent profile with an ID.
   */
  create(profileData: Omit<AgentProfile, 'id'>): AgentProfile {
    const id = uuidv4();
    const newProfile: AgentProfile = {
      id,
      ...profileData,
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  /**
   * Finds an agent profile by its ID.
   * @param id The ID of the agent profile to find.
   * @returns The agent profile.
   * @throws NotFoundException if the profile is not found.
   */
  findById(id: string): AgentProfile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new NotFoundException(`Agent profile with ID "${id}" not found.`);
    }
    return profile;
  }

  /**
   * Returns all agent profiles.
   * @returns An array of all agent profiles.
   */
  findAll(): AgentProfile[] {
    return Array.from(this.profiles.values());
  }
}
