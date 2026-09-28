import time

class Request:
    def __init__(self, id, processing_time, priority):
        self.id = id
        self.processing_time = processing_time
        self.priority = priority
        # Value per unit time (useful for greedy approach)
        self.ratio = priority / processing_time if processing_time > 0 else 0

def greedy_scheduling(requests, max_time_window):
    """
    Greedy approach to schedule API requests (Fractional/0-1 Knapsack approximation).
    Sorts requests by priority-to-time ratio and picks them until the time window is full.
    """
    # Sort requests by ratio (descending)
    sorted_requests = sorted(requests, key=lambda x: x.ratio, reverse=True)
    
    selected_requests = []
    current_time = 0
    total_priority = 0
    
    for req in sorted_requests:
        if current_time + req.processing_time <= max_time_window:
            selected_requests.append(req.id)
            current_time += req.processing_time
            total_priority += req.priority
            
    return selected_requests, total_priority

def dp_scheduling(requests, max_time_window):
    """
    Dynamic Programming approach for API request scheduling (0-1 Knapsack).
    Guarantees the optimal selection of requests to maximize total priority.
    """
    n = len(requests)
    # dp[i][w] stores the max priority using first i requests within w time
    dp = [[0 for _ in range(max_time_window + 1)] for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        req = requests[i-1]
        for w in range(1, max_time_window + 1):
            if req.processing_time <= w:
                dp[i][w] = max(
                    req.priority + dp[i-1][w - req.processing_time],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
                
    # Backtrack to find the selected items
    selected_requests = []
    w = max_time_window
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            req = requests[i-1]
            selected_requests.append(req.id)
            w -= req.processing_time
            
    return selected_requests, dp[n][max_time_window]

def compare_scheduling(requests, max_time_window):
    print(f"\n--- API Request Scheduling Comparison ---")
    print(f"Total Requests: {len(requests)}, Max Time Window: {max_time_window}ms")
    
    start_time = time.time()
    greedy_res, greedy_val = greedy_scheduling(requests, max_time_window)
    greedy_time = time.time() - start_time
    
    start_time = time.time()
    dp_res, dp_val = dp_scheduling(requests, max_time_window)
    dp_time = time.time() - start_time
    
    print(f"[Greedy] Max Priority: {greedy_val}, Scheduled: {greedy_res}, Time taken: {greedy_time:.5f}s")
    print(f"[DP]     Max Priority: {dp_val}, Scheduled: {dp_res}, Time taken: {dp_time:.5f}s")
    return greedy_val, dp_val
