#include <stdio.h> 
#include <stdlib.h> 
 
int main() { 
    int n, head, dir, totalMov = 0; 
    printf("Enter the number of disk requests: "); 
    scanf("%d", &n); 
    int requests[n]; 
    printf("Enter the request string: "); 
    for (int i = 0; i < n; i++) { 
        scanf("%d", &requests[i]); 
    } 
    printf("Enter the initial head position: "); 
    scanf("%d", &head); 
    printf("Enter the direction of reading (0 -> left, 1 -> right): "); 
    scanf("%d", &dir); 
    for (int i = 0; i < n - 1; i++) { 
        for (int j = 0; j < n - i - 1; j++) { 
            if (requests[j] > requests[j + 1]) { 
                int temp = requests[j]; 
                requests[j] = requests[j + 1]; 
                requests[j + 1] = temp; 
            } 
        } 
    } 
    int idx = 0; 
    while (idx < n && requests[idx] < head) { 
        idx++; 
    } 
    if (dir == 1) { 
        for (int i = idx; i < n; i++) { 
            totalMov += abs(head - requests[i]); 
            head = requests[i]; 
        } 
        totalMov += abs(head - 199); 
        head = 199; 
        for (int i = idx - 1; i >= 0; i--) { 
            totalMov += abs(head - requests[i]); 
            head = requests[i]; 
        } 
    } 
    else { 
        for (int i = idx - 1; i >= 0; i--) { 
            totalMov += abs(head - requests[i]); 
            head = requests[i]; 
        } 
        totalMov += abs(head - 0); 
        head = 0; 
        for (int i = idx; i < n; i++) { 
            totalMov += abs(head - requests[i]); 
            head = requests[i]; 
        } 
    } 
    printf("Total Movements: %d\n", totalMov); 
    return 0; 
}