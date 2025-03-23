from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class NeonPoker():
    """NeonPoker crew"""

    # Paths to the YAML configuration files for agents and tasks.
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    # Define agents based on their roles.
    @agent
    def core_game_mechanics(self) -> Agent:
        return Agent(
            config=self.agents_config['core_game_mechanics'],
            verbose=True
        )

    @agent
    def neural_bluff(self) -> Agent:
        return Agent(
            config=self.agents_config['neural_bluff'],
            verbose=True
        )

    @agent
    def quantum_swap(self) -> Agent:
        return Agent(
            config=self.agents_config['quantum_swap'],
            verbose=True
        )

    @agent
    def glitch_the_river(self) -> Agent:
        return Agent(
            config=self.agents_config['glitch_the_river'],
            verbose=True
        )

    @agent
    def predictive_bet(self) -> Agent:
        return Agent(
            config=self.agents_config['predictive_bet'],
            verbose=True
        )

    @agent
    def ui_ux(self) -> Agent:
        return Agent(
            config=self.agents_config['ui_ux'],
            verbose=True
        )

    @agent
    def animations(self) -> Agent:
        return Agent(
            config=self.agents_config['animations'],
            verbose=True
        )

    @agent
    def user_input(self) -> Agent:
        return Agent(
            config=self.agents_config['user_input'],
            verbose=True
        )

    @agent
    def data_handling(self) -> Agent:
        return Agent(
            config=self.agents_config['data_handling'],
            verbose=True
        )

    @agent
    def responsive_design(self) -> Agent:
        return Agent(
            config=self.agents_config['responsive_design'],
            verbose=True
        )

    @agent
    def game_flow(self) -> Agent:
        return Agent(
            config=self.agents_config['game_flow'],
            verbose=True
        )

    # Define tasks corresponding to each agent.
    @task
    def core_game_mechanics_task(self) -> Task:
        return Task(
            config=self.tasks_config['core_game_mechanics']
        )

    @task
    def neural_bluff_task(self) -> Task:
        return Task(
            config=self.tasks_config['neural_bluff']
        )

    @task
    def quantum_swap_task(self) -> Task:
        return Task(
            config=self.tasks_config['quantum_swap']
        )

    @task
    def glitch_the_river_task(self) -> Task:
        return Task(
            config=self.tasks_config['glitch_the_river']
        )

    @task
    def predictive_bet_task(self) -> Task:
        return Task(
            config=self.tasks_config['predictive_bet']
        )

    @task
    def ui_ux_task(self) -> Task:
        return Task(
            config=self.tasks_config['ui_ux']
        )

    @task
    def animations_task(self) -> Task:
        return Task(
            config=self.tasks_config['animations']
        )

    @task
    def user_input_task(self) -> Task:
        return Task(
            config=self.tasks_config['user_input']
        )

    @task
    def data_handling_task(self) -> Task:
        return Task(
            config=self.tasks_config['data_handling']
        )

    @task
    def responsive_design_task(self) -> Task:
        return Task(
            config=self.tasks_config['responsive_design']
        )

    @task
    def game_flow_task(self) -> Task:
        return Task(
            config=self.tasks_config['game_flow']
        )

    @crew
    def crew(self) -> Crew:
        """Creates and coordinates the Neon Poker crew."""
        return Crew(
            agents=[
                self.core_game_mechanics(),
                self.neural_bluff(),
                self.quantum_swap(),
                self.glitch_the_river(),
                self.predictive_bet(),
                self.ui_ux(),
                self.animations(),
                self.user_input(),
                self.data_handling(),
                self.responsive_design(),
                self.game_flow()
            ],
            tasks=[
                self.core_game_mechanics_task(),
                self.neural_bluff_task(),
                self.quantum_swap_task(),
                self.glitch_the_river_task(),
                self.predictive_bet_task(),
                self.ui_ux_task(),
                self.animations_task(),
                self.user_input_task(),
                self.data_handling_task(),
                self.responsive_design_task(),
                self.game_flow_task()
            ],
            process=Process.sequential,
            verbose=True,
        )
