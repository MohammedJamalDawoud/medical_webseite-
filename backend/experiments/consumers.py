"""
WebSocket consumers for real-time pipeline monitoring.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer


class PipelineStatusConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time pipeline status updates.
    
    Clients can subscribe to pipeline status updates and receive
    live progress, stage information, and log messages.
    """
    
    async def connect(self):
        """Accept WebSocket connection."""
        await self.accept()
        
        # Join pipeline updates group
        await self.channel_layer.group_add(
            "pipeline_updates",
            self.channel_name
        )
    
    async def disconnect(self, close_code):
        """Leave pipeline updates group."""
        await self.channel_layer.group_discard(
            "pipeline_updates",
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Handle messages from WebSocket client.
        
        Clients can send subscription requests for specific pipelines.
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'subscribe':
                run_id = data.get('run_id')
                if run_id:
                    # Join specific pipeline group
                    await self.channel_layer.group_add(
                        f"pipeline_{run_id}",
                        self.channel_name
                    )
                    await self.send(text_data=json.dumps({
                        'type': 'subscription_confirmed',
                        'run_id': run_id
                    }))
            
            elif action == 'unsubscribe':
                run_id = data.get('run_id')
                if run_id:
                    # Leave specific pipeline group
                    await self.channel_layer.group_discard(
                        f"pipeline_{run_id}",
                        self.channel_name
                    )
                    
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
    
    async def pipeline_status(self, event):
        """
        Send pipeline status update to WebSocket client.
        
        Called when a pipeline status message is broadcast to the group.
        """
        await self.send(text_data=json.dumps(event))
    
    async def pipeline_log(self, event):
        """
        Send pipeline log message to WebSocket client.
        """
        await self.send(text_data=json.dumps(event))
    
    async def pipeline_progress(self, event):
        """
        Send pipeline progress update to WebSocket client.
        """
        await self.send(text_data=json.dumps(event))
