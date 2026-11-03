## 🗂️ Machine Learning
*Purpose: Explain how a model uses examples and data to learn patterns that support classification, prediction, or other tasks.*

### Learning outcomes
- Define Machine Learning and its relationship to AI.
- Identify data, features, labels, models, training, testing, and inference.
- Describe a simplified ML workflow.
- Distinguish supervised, unsupervised, and reinforcement learning.
- Explain why data quality and evaluation matter.

#### 4.1 What is Machine Learning?
Machine Learning (ML) is an area of AI focused on developing computer systems that adapt or learn from data to improve performance on a task. Instead of writing every decision rule by hand, developers choose a learning method and provide examples or feedback. The algorithm adjusts a model so that it captures patterns useful for the task.

#### 4.2 Essential vocabulary
-	Dataset: a collection of examples used for analysis or learning.
-	Feature: an input characteristic used by a model, such as message length or number of links in an email.
-	Label: the target answer attached to an example, such as “spam” or “not spam”.
-	Model: the learned computational structure that maps inputs to outputs.
-	Training: adjusting a model using data and a learning objective.
-	Testing: evaluating a trained model on separate examples to estimate performance on unseen data.
-	Inference: using a trained model to produce an output for a new input.
-	Evaluation metric: a measure of performance, such as accuracy, precision, or recall.

#### 4.3 A simplified ML workflow
-	Define the problem and decide what a useful output looks like.
-	Collect data that is relevant, lawful to use, and sufficiently representative.
-	Clean and prepare data; check missing values, errors, duplicates, and potential bias.
-	Separate data for training and evaluation so performance can be tested fairly.
-	Train the model by adjusting parameters to reduce errors according to a chosen objective.
-	Evaluate on data not used for training and examine errors, not only one headline score.
-	Deploy if suitable, monitor the model, and update it when data or the environment changes.

#### 4.4 Supervised Learning
Supervised Learning uses examples that include the desired answer, often called labels. The model learns a relationship between input features and labels. Classification predicts a category, such as spam or not spam. Regression predicts a numerical value, such as estimated delivery time or house price. The quality and representativeness of labelled examples strongly affect the result.

#### 4.5 Unsupervised Learning
Unsupervised Learning looks for structure in data without being given the correct label for every example. 

Clustering is a common task: a model groups items that appear similar according to selected features. A retailer might explore groups of purchasing patterns. A discovered group is not automatically meaningful; people must interpret and validate it.

#### 4.6 Reinforcement Learning
Reinforcement Learning involves an agent taking actions in an environment and receiving feedback in the form of rewards or penalties. Through repeated interaction, the agent learns a strategy or policy that aims to maximize long-term reward. It is used in game-playing and some robotics or control problems. A reward signal is only a simplified representation of the goal, so poorly designed rewards can lead to undesirable behaviour.

#### 4.7 Generalization, overfitting, and data quality
A model should work on new examples, not merely memorize training data. Overfitting occurs when a model performs well on training examples but poorly on unseen data because it has learned details that do not generalize. Data can also be incomplete, outdated, unbalanced, mislabeled, or unrepresentative. These issues can make predictions unreliable or unfair.

#### 4.8 Model evaluation
Accuracy is the proportion of predictions that are correct, but it can mislead when one category is much more common than another. Precision asks, among items predicted positive, how many were truly positive. Recall asks, among all truly positive items, how many the model found. The appropriate metric depends on the consequences of different errors.

### Worked example
Imagine training a spam classifier. The dataset contains example emails labelled “spam” or “not spam.” The model may learn that combinations of words, links, sender patterns, and message features are associated with spam. When a new email arrives, the trained model estimates which category is more likely. It can still make mistakes: a legitimate message may contain suspicious wording, or a new spam message may use unfamiliar patterns.

### Try it: learning activity
Run a no-code “human classifier” activity. Give learners 12 sample messages labelled spam or not spam and ask them to identify patterns. Then give 4 new messages, including unusual examples. Discuss which patterns helped, where the group disagreed, and why a real model needs separate evaluation data and ongoing monitoring.

### Check your understanding
	1. What is the difference between a dataset and a model?
	2. What is a feature? Give one possible feature for spam detection.
	3. How does supervised learning differ from unsupervised learning?
	4. What role does feedback or reward play in reinforcement learning?
	5. Why test a model on examples not used for training?
	6. What is overfitting?

### Common misconceptions to avoid
	Machine Learning means a computer learns exactly as a human does.
	A model that scores highly on training data must be reliable in the real world.
	More data always guarantees a better model, even when data is biased or poor quality.
	Accuracy is always the best metric for every problem.

### Key takeaways
-	Machine Learning is one important approach within AI.
-	Models learn patterns from data according to a defined training process.
-	Training and testing serve different purposes.
-	Data quality, representative examples, evaluation, and monitoring are essential.
