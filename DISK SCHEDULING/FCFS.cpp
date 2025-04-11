#include<stdio.h> 
#include<stdlib.h> 
int main(){ 
    int n; 
    printf("Enter the number of disk requests: "); 
    scanf("%d",&n); 
    int requests[n]; 
    printf("Enter the request string: "); 
    for(int i=0;i<n;i++){ 
        scanf("%d",&requests[i]); 
    } 
    int head=requests[0]; 
    int totalMov=0; 
    for(int i=1;i<n;i++){ 
        totalMov+=abs(requests[i]-requests[i-1]); 
    } 
    printf("Total Requests: %d",totalMov); 
    return 0; 
}
