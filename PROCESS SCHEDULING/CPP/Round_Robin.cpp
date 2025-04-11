#include<stdio.h>
#include<stdlib.h>
#include<limits.h>
struct process{
	int id,at,bt,st,ct,rt,completed,rem_bt;
	float tat,wt;
};
typedef struct process process;
int findMax(int a, int b){
	return a>b?a:b;
}
int compareAt(const void *p1,const void *p2){
	int a=((process*)p1)->at;
	int b=((process*)p2)->at;
	return a<b?-1:1;
}
int compareId(const void *p1,const void *p2){
	int a=((process*)p1)->id;
	int b=((process*)p2)->id;
	return a<b?-1:1;
}
int main(){
	int n;
	printf("Enter the number of processes: ");
	scanf("%d",&n);
	process p[n];
	int i,isFirst=1;
	for(i=0;i<n;i++){
		printf("Enter the AT and BT of P%d: ", i);
		scanf("%d%d",&p[i].at,&p[i].bt);
		p[i].id=i;
		p[i].rem_bt=p[i].bt;
		p[i].completed=0;
	}
	int tq;
	printf("Enter the time quanta: ");
	scanf("%d",&tq);
	int totalWt=0,totalTat=0,totalBt=0,completed=0,idleTime=0,currentTime=0;
	int queue[100],front=0,rear=0;
	qsort((void *)p,n,sizeof(process),compareAt);
	queue[rear]=0;
	p[0].completed=1;
	int gChart[200],gIdx=0;
	printf("Gantt Chart: \n");
	while(completed<n){
		int idx=queue[front];
		front++;
		if(p[idx].rem_bt==p[idx].bt){
			p[idx].st=findMax(p[idx].at,currentTime);
			idleTime+=(isFirst==1)?0:p[idx].st-currentTime;
			currentTime=p[idx].st;
			isFirst=0;
		}
		gChart[gIdx++]=p[idx].id;
		if(p[idx].rem_bt-tq>0){
			p[idx].rem_bt-=tq;
			currentTime+=tq;
		}
		else{
			p[idx].completed=1;
			completed++;
			p[idx].ct=currentTime+p[idx].rem_bt;
			currentTime+=p[idx].rem_bt;
			p[idx].rem_bt=0;
			p[idx].ct=currentTime; 
            p[idx].tat=p[idx].ct-p[idx].at; 
            p[idx].wt=p[idx].tat-p[idx].bt; 
            p[idx].rt=p[idx].st-p[idx].at; 
            totalTat+=p[idx].tat;
            totalWt+=p[idx].wt; 
            //totalRt+=p[idx].rt; 
		}
		for(i=1;i<n;i++){
			if(p[i].rem_bt>0 && p[i].completed==0 && p[i].at<=currentTime){
				queue[++rear]=i;
				p[i].completed=1;
			}
		}
		if(p[idx].rem_bt>0)
			queue[++rear]=idx;
		if(front>rear){
			for(i=1;i<n;i++){
				if(p[i].rem_bt>0){
					p[i].completed=1;
					queue[rear++]=i;
					break;
				}
			}
		}
	}
	for(i=0;i<gIdx;i++)
		printf("P%d  ",gChart[i]);
	printf("\n\nPID\tAT\tBT\tCT\tRT\tTAT\tWT\n");
    for (i=0;i<n;i++){
        printf("%d\t%d\t%d\t%d\t%d\t%.2f\t%.2f\n",p[i].id,p[i].at,p[i].bt,p[i].ct,p[i].rt,p[i].tat,p[i].wt);
    }
	int totalTime=currentTime-p[0].at;
	float cpuUtil=(float)(totalTime-idleTime)/totalTime*100;
	float avgTat=(float)totalTat/n;
	float avgWt=(float)totalWt/n;
	printf("AVG WT:%f\nAVG TAT: %f\nCPU UTIL: %f",avgWt,avgTat,cpuUtil);
	return 0;
}
